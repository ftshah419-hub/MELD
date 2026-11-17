import mongoose from 'mongoose';
import { BookListing } from '../models/BookListing.js';
import { Request } from '../models/Request.js';
import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const bookBridgeController = {
  /**
   * Browse available books
   */
  getBooks: asyncHandler(async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      const fallbackBooks = [
        {
          _id: 'b1',
          title: 'NCERT Class 11 & 12 Physics Set (Complete)',
          author: 'Prof. H.C. Verma & NCERT Board',
          genre: 'Competitive Exams',
          gradeLevel: 'Higher Secondary',
          language: 'English',
          condition: 'GOOD',
          location: 'Jayanagar, Bengaluru',
          donorName: 'Ananya Rao',
          status: 'AVAILABLE'
        },
        {
          _id: 'b2',
          title: 'Malgudi Days & Selected Stories',
          author: 'R.K. Narayan',
          genre: 'Literature & Fiction',
          gradeLevel: 'General Reader',
          language: 'English',
          condition: 'LIKE_NEW',
          location: 'Mysuru, Karnataka',
          donorName: 'Govind Swamy',
          status: 'AVAILABLE'
        }
      ];
      return sendResponse(res, 200, 'Books retrieved successfully', {
        books: fallbackBooks,
        total: fallbackBooks.length,
        page: 1,
        pages: 1
      });
    }

    const {
      search,
      genre,
      condition,
      status = 'AVAILABLE',
      limit = 24,
      page = 1,
      sort = 'newest'
    } = req.query;

    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (genre && genre !== 'all') {
      filter.genre = new RegExp(`^${genre}$`, 'i');
    }
    if (condition && condition !== 'all') {
      filter.condition = condition.toUpperCase();
    }

    const sortOptions = sort === 'newest' ? { createdAt: -1 } : { title: 1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [books, total] = await Promise.all([
      BookListing.find(filter)
        .populate('donorId', 'fullName profileImage')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      BookListing.countDocuments(filter)
    ]);

    let results = books;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = books.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q) ||
          b.isbn?.toLowerCase().includes(q) ||
          b.genre?.toLowerCase().includes(q)
      );
    }

    return sendResponse(res, 200, 'Books retrieved successfully', {
      books: results,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  }),

  /**
   * Get single book detail
   */
  getBookById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const book = await BookListing.findById(id).populate(
      'donorId',
      'fullName email profileImage'
    );

    if (!book) {
      throw ApiError.notFound('Book listing not found.');
    }

    return sendResponse(res, 200, 'Book details retrieved', { book });
  }),

  /**
   * List an unused book for donation or exchange
   */
  createBook: asyncHandler(async (req, res) => {
    const donorId = req.user.id || req.user._id;
    const { title, author, isbn, genre, condition, images } = req.body;

    if (!title || !author) {
      throw ApiError.badRequest('Book title and author are required.');
    }

    const formattedImages = Array.isArray(images) && images.length > 0
      ? images.map((img) => (typeof img === 'string' ? { url: img, publicId: null } : img))
      : [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', publicId: null }];

    const book = await BookListing.create({
      donorId,
      title: title.trim(),
      author: author.trim(),
      isbn: isbn ? isbn.trim() : '',
      genre: genre ? genre.trim() : 'General',
      condition: condition ? condition.toUpperCase() : 'GOOD',
      images: formattedImages,
      status: 'AVAILABLE'
    });

    return sendResponse(res, 201, 'Book listed successfully for community circulation', { book });
  }),

  /**
   * Update own book listing
   */
  updateBook: asyncHandler(async (req, res) => {
    const donorId = req.user.id || req.user._id;
    const { id } = req.params;
    const { title, author, isbn, genre, condition, images, status } = req.body;

    const book = await BookListing.findOne({ _id: id, donorId });
    if (!book) {
      throw ApiError.notFound('Book listing not found or unauthorized.');
    }

    if (title) book.title = title.trim();
    if (author) book.author = author.trim();
    if (isbn !== undefined) book.isbn = isbn.trim();
    if (genre) book.genre = genre.trim();
    if (condition) book.condition = condition.toUpperCase();
    if (status) book.status = status;
    if (images && Array.isArray(images)) {
      book.images = images.map((img) => (typeof img === 'string' ? { url: img, publicId: null } : img));
    }

    await book.save();

    return sendResponse(res, 200, 'Book listing updated successfully', { book });
  }),

  /**
   * Delete own book listing
   */
  deleteBook: asyncHandler(async (req, res) => {
    const donorId = req.user.id || req.user._id;
    const { id } = req.params;

    const book = await BookListing.findOneAndDelete({ _id: id, donorId });
    if (!book) {
      throw ApiError.notFound('Book listing not found or unauthorized.');
    }

    return sendResponse(res, 200, 'Book listing deleted successfully');
  }),

  /**
   * Get user's own listed books
   */
  getMyListings: asyncHandler(async (req, res) => {
    const donorId = req.user.id || req.user._id;

    const listings = await BookListing.find({ donorId }).sort({ createdAt: -1 });

    return sendResponse(res, 200, 'My book listings retrieved', { listings });
  }),

  /**
   * Request a book for learning or reading
   */
  requestBook: asyncHandler(async (req, res) => {
    const requesterId = req.user.id || req.user._id;
    const { bookId, purpose, deliveryMethod, message } = req.body;

    if (!bookId || !message) {
      throw ApiError.badRequest('Book ID and request explanation message are required.');
    }

    const book = await BookListing.findById(bookId);
    if (!book) {
      throw ApiError.notFound('Book listing not found.');
    }

    if (book.donorId.toString() === requesterId.toString()) {
      throw ApiError.badRequest('You cannot request your own listed book.');
    }

    if (book.status !== 'AVAILABLE') {
      throw ApiError.badRequest(`This book is currently "${book.status}" and cannot be requested.`);
    }

    const formattedMessage = `Purpose: ${purpose || 'Educational study'}\nDelivery Channel: ${deliveryMethod || 'Community Drop-Box'}\nMessage: ${message}`;

    const request = await Request.create({
      requesterId,
      module: 'BOOK_BRIDGE',
      targetType: 'BookListing',
      targetId: book._id,
      requestType: 'BOOK_BORROW',
      message: formattedMessage,
      status: 'PENDING'
    });

    // Notify donor
    await Notification.create({
      userId: book.donorId,
      title: 'New Book Request Received',
      message: `Someone requested your book "${book.title}".`,
      type: 'REQUEST',
      link: '/user/book-bridge/my-donations'
    });

    return sendResponse(res, 201, 'Book request submitted successfully', { request });
  }),

  /**
   * Get user's book requests
   */
  getMyRequests: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;

    const requests = await Request.find({
      requesterId: userId,
      module: 'BOOK_BRIDGE'
    })
      .populate('targetId')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, 'My book requests retrieved', { requests });
  }),

  /**
   * Get incoming requests for donor's books
   */
  getIncomingRequests: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;

    const myBooks = await BookListing.find({ donorId: userId }).select('_id');
    const bookIds = myBooks.map((b) => b._id);

    const requests = await Request.find({
      module: 'BOOK_BRIDGE',
      targetId: { $in: bookIds }
    })
      .populate('requesterId', 'fullName email profileImage')
      .populate('targetId')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, 'Incoming book requests retrieved', { requests });
  }),

  /**
   * Donor respond: Accept or decline request
   */
  respondToRequest: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;
    const { action, responseNote } = req.body;

    if (!['ACCEPT', 'REJECT'].includes(action)) {
      throw ApiError.badRequest('Action must be ACCEPT or REJECT.');
    }

    const request = await Request.findById(id).populate('targetId');
    if (!request || request.module !== 'BOOK_BRIDGE') {
      throw ApiError.notFound('Book request not found.');
    }

    const book = await BookListing.findById(request.targetId?._id);
    if (!book || book.donorId.toString() !== userId.toString()) {
      throw ApiError.forbidden('Unauthorized to manage this request.');
    }

    request.status = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';
    request.responseNote = responseNote || (action === 'ACCEPT' ? 'Request accepted! Transit slip generated.' : 'Request declined.');
    await request.save();

    if (action === 'ACCEPT') {
      book.status = 'CIRCULATING';
      book.recipientId = request.requesterId;
      await book.save();
    }

    // Notify requester
    await Notification.create({
      userId: request.requesterId,
      title: `Book Request ${action === 'ACCEPT' ? 'Accepted' : 'Declined'}`,
      message: `Your request for "${book.title}" was ${action === 'ACCEPT' ? 'accepted! Check pickup or shipping details.' : 'declined.'}`,
      type: 'REQUEST',
      link: '/user/requests'
    });

    return sendResponse(res, 200, `Request ${request.status.toLowerCase()} successfully`, { request, book });
  }),

  /**
   * Complete book transfer
   */
  completeBook: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;

    const book = await BookListing.findOne({ _id: id, donorId: userId });
    if (!book) {
      throw ApiError.notFound('Book listing not found or unauthorized.');
    }

    book.status = 'DONATED';
    await book.save();

    // Mark associated request COMPLETED
    await Request.updateMany(
      { targetId: book._id, status: 'ACCEPTED' },
      { status: 'COMPLETED' }
    );

    return sendResponse(res, 200, 'Book transfer marked as completed', { book });
  })
};

export default bookBridgeController;
