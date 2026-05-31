import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import PostComposer from './PostComposer';

const ScheduledPostsPage = () => {
  const navigate = useNavigate();
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [composerOpen, setComposerOpen] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, post: null });
  const [editContent, setEditContent] = useState('');
  const [editMediaUrl, setEditMediaUrl] = useState('');
  const [editMediaType, setEditMediaType] = useState('image');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchScheduledPosts();
  }, [page]);

  const fetchScheduledPosts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getScheduledPosts(null, page, 10);
      setScheduledPosts(data.scheduledPosts || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Failed to fetch scheduled posts:', error);
      showNotification('Failed to load scheduled posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleCancelPost = async (postId) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled post?')) {
      return;
    }

    try {
      await apiService.cancelScheduledPost(postId);
      showNotification('Scheduled post cancelled successfully', 'success');
      fetchScheduledPosts();
    } catch (error) {
      console.error('Failed to cancel post:', error);
      showNotification('Failed to cancel scheduled post', 'error');
    }
  };

  const handleEditClick = (post) => {
    setEditContent(post.content);
    setEditMediaUrl(post.mediaUrl || '');
    setEditMediaType(post.mediaType || 'image');
    setEditDialog({ open: true, post });
  };

  const handleEditSave = async () => {
    if (!editContent.trim()) {
      showNotification('Content cannot be empty', 'error');
      return;
    }

    try {
      await apiService.updateScheduledPost(editDialog.post.id, {
        content: editContent.trim(),
        mediaUrl: editMediaUrl.trim() || null,
        mediaType: editMediaUrl.trim() ? editMediaType : null
      });
      showNotification('Post updated successfully', 'success');
      setEditDialog({ open: false, post: null });
      setEditContent('');
      setEditMediaUrl('');
      fetchScheduledPosts();
    } catch (error) {
      console.error('Failed to update post:', error);
      showNotification('Failed to update post', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'posted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Posted
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Failed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Scheduled
          </span>
        );
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'linkedin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4F8FA] hover:bg-[#E8F1F5] text-[#0077b5] text-xs font-medium rounded border border-[#E1EEF2] transition-colors">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            LinkedIn
          </span>
        );
      case 'twitter':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-medium rounded border border-slate-200 transition-colors">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Twitter
          </span>
        );
      case 'facebook':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F0F2F9] hover:bg-[#E2E6F2] text-[#1877F2] text-xs font-medium rounded border border-[#D5DCF2] transition-colors">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
            </svg>
            Facebook
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {notification.show && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] max-w-md">
            {notification.type === 'error' ? (
              <div className="flex-shrink-0 p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            ) : notification.type === 'warning' ? (
              <div className="flex-shrink-0 p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            ) : (
              <div className="flex-shrink-0 p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <span className="text-sm font-semibold text-slate-800 pr-2 leading-tight">{notification.message}</span>
            <button
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              className="ml-auto text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Scheduled Posts</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Write, design, and orchestrate custom posts with image/video attachments for automated dispatch.
          </p>
        </div>
        <button
          onClick={() => setComposerOpen(true)}
          className="inline-flex items-center gap-2 justify-center px-5 py-2.5 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Post
        </button>
      </div>

      {loading && scheduledPosts.length === 0 ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
          </div>
        </div>
      ) : scheduledPosts.length === 0 ? (
        /* Empty state */
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">No scheduled posts yet</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Design your first rich custom post, set the timing, add media link assets, and schedule.
          </p>
          <button
            onClick={() => setComposerOpen(true)}
            className="mt-6 inline-flex items-center gap-2 justify-center px-4 py-2.5 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
          >
            Create Your First Post
          </button>
        </div>
      ) : (
        /* Scheduled Posts list */
        <div className="space-y-6">
          <div className="grid gap-6">
            {scheduledPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-slate-150 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  {/* Status header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {getStatusBadge(post.status)}
                      <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(post.scheduledAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </span>
                    </div>

                    {post.status === 'scheduled' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditClick(post)}
                          title="Edit scheduled post"
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleCancelPost(post.id)}
                          title="Cancel scheduled post"
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="space-y-4">
                    <p className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
                      {post.content}
                    </p>

                    {/* Media Preview Attachment */}
                    {post.mediaUrl && (
                      <div className="mt-3 border border-slate-100 rounded-xl overflow-hidden bg-slate-50 max-w-lg">
                        {post.mediaType === 'video' ? (
                          <video 
                            src={post.mediaUrl} 
                            controls 
                            className="w-full max-h-72 object-cover"
                          />
                        ) : (
                          <img 
                            src={post.mediaUrl} 
                            alt="Attached post media" 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=400&h=200&q=80';
                            }}
                            className="w-full max-h-72 object-cover"
                          />
                        )}
                      </div>
                    )}

                    {/* Error Notification Alert */}
                    {post.error && (
                      <div className="flex gap-2.5 items-start p-3.5 bg-rose-50 border border-rose-150 rounded-xl text-rose-800 text-xs sm:text-sm mt-3">
                        <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <span className="font-bold block mb-0.5">Post Dispatch Failure</span>
                          {post.error}
                        </div>
                      </div>
                    )}

                    {/* Published log */}
                    {post.postedAt && (
                      <span className="inline-block text-xs font-semibold text-slate-400">
                        Published on {new Date(post.postedAt).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-slate-100 my-4"></div>

                  {/* Platforms Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 mr-1.5">Platforms:</span>
                    {post.platforms?.map((platform) => (
                      <div key={platform.platform}>
                        {getPlatformIcon(platform.platform)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm font-semibold text-slate-700 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Post Composer Modal Overlay */}
      {composerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Create Scheduled Post</h2>
              <button
                onClick={() => setComposerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[80vh]">
              <PostComposer
                onSuccess={() => {
                  setComposerOpen(false);
                  fetchScheduledPosts();
                  showNotification('Post scheduled successfully', 'success');
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Content Dialog */}
      {editDialog.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Edit Post</h2>
              <button
                onClick={() => setEditDialog({ open: false, post: null })}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Content
                </label>
                <textarea
                  className="w-full min-h-[140px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-sm font-medium transition-all"
                  placeholder="Update your post content..."
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Media Attachment Link
                </label>
                <input
                  type="url"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-sm font-medium transition-all"
                  placeholder="https://example.com/image.jpg"
                  value={editMediaUrl}
                  onChange={(e) => setEditMediaUrl(e.target.value)}
                />
              </div>

              {editMediaUrl.trim() && (
                <div className="flex gap-4 items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Media Type:</span>
                  <label className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="editMediaType"
                      checked={editMediaType === 'image'}
                      onChange={() => setEditMediaType('image')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    Image
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="editMediaType"
                      checked={editMediaType === 'video'}
                      onChange={() => setEditMediaType('video')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    Video
                  </label>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setEditDialog({ open: false, post: null })}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 bg-white font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-semibold text-sm transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledPostsPage;
