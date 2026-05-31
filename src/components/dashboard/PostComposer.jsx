import { useState, useEffect, useRef } from 'react';
import apiService from '../../services/api';
import { useUser } from '../../hooks/useUser';

const PostComposer = ({ onSuccess, initialContent }) => {
  const { user: currentUser, userPlan } = useUser();
  const [content, setContent] = useState(initialContent || '');
  const [platforms, setPlatforms] = useState([]);
  const [scheduledAt, setScheduledAt] = useState('');
  const [postNow, setPostNow] = useState(true);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [loading, setLoading] = useState(false);
  const [socialConnections, setSocialConnections] = useState({});
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [uploadMode, setUploadMode] = useState('url');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const textareaRef = useRef(null);

  const popularEmojis = [
    '👇', '🔥', '🚀', '💡', '✨', '📈', '🗓️', '👏', 
    '✅', '💻', '✍️', '🎯', '🤝', '🌟', '📣', '🧠', 
    '❤️', '👍', '😊', '🙌', '🎉', '🤔', '👀', '💯'
  ];

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const connections = await apiService.getSocialConnections();
        const connectionsMap = {};
        connections.connections?.forEach(conn => {
          connectionsMap[conn.platform] = true;
        });
        setSocialConnections(connectionsMap);
      } catch (error) {
        console.error('Failed to fetch connections:', error);
      }
    };

    fetchConnections();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const processFile = async (file) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      showNotification('Invalid file type. Only images and videos are supported.', 'error');
      return;
    }

    const limit = isImage ? 5 * 1024 * 1024 : 25 * 1024 * 1024;
    if (file.size > limit) {
      const sizeText = isImage ? '5MB' : '25MB';
      showNotification(`File size exceeds the limit of ${sizeText} for ${isImage ? 'images' : 'videos'}.`, 'error');
      return;
    }

    setUploadingFile(true);
    try {
      const response = await apiService.uploadMedia(file);
      setMediaUrl(response.mediaUrl);
      setMediaType(response.mediaType);
      setUploadedFileName(file.name);
      showNotification('File uploaded successfully!', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showNotification(error.message || 'Failed to upload file.', 'error');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (uploadingFile) return;
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handlePlatformToggle = (platform) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter(p => p !== platform));
    } else {
      if (socialConnections[platform]) {
        setPlatforms([...platforms, platform]);
      } else {
        showNotification(`Please connect ${platform} account first`, 'warning');
      }
    }
  };

  const handleScheduleToggle = () => {
    const nextPostNow = !postNow;
    setPostNow(nextPostNow);
    
    if (!nextPostNow && !scheduledAt) {
      const oneHourLater = new Date();
      oneHourLater.setHours(oneHourLater.getHours() + 1);
      
      const year = oneHourLater.getFullYear();
      const month = String(oneHourLater.getMonth() + 1).padStart(2, '0');
      const day = String(oneHourLater.getDate()).padStart(2, '0');
      const hours = String(oneHourLater.getHours()).padStart(2, '0');
      const minutes = String(oneHourLater.getMinutes()).padStart(2, '0');
      setScheduledAt(`${year}-${month}-${day}T${hours}:${minutes}`);
    }
  };

  // Selection formatting helpers
  const getSelectionInfo = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { start: 0, end: 0, text: '' };
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = content.slice(start, end);
    return { start, end, text };
  };

  const applyTextChange = (newText, newCursorPos) => {
    setContent(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 50);
  };

  const handleFormatBold = () => {
    const { start, end, text } = getSelectionInfo();
    if (!text) {
      showNotification('Highlight text to make it bold', 'info');
      return;
    }

    const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const boldChars = [
      "𝗔","𝗕","𝗖","𝗗","𝗘","𝗙","𝗚","𝗛","𝗜","𝗝","𝗞","𝗟","𝗠","𝗡","𝗢","𝗣","𝗤","𝗥","𝗦","𝗧","𝗨","𝗩","𝗪","𝗫","𝗬","𝗭",
      "𝗮","𝗯","𝗰","𝗱","𝗲","𝗳","𝗴","𝗵","𝗶","𝗷","𝗸","𝗹","𝗺","𝗻","𝗼","𝗽","𝗾","𝗿","𝘀","𝘁","𝘂","𝘃","𝘄","𝘅","𝘆","𝘇",
      "𝟬","𝟭","𝟮","𝟯","𝟰","𝟱","𝟲","𝟳","𝟴","𝟵"
    ];

    const formatted = text.split('').map(c => {
      const idx = normal.indexOf(c);
      return idx > -1 ? boldChars[idx] : c;
    }).join('');

    const updatedText = content.slice(0, start) + formatted + content.slice(end);
    applyTextChange(updatedText, start + formatted.length);
  };

  const handleFormatItalic = () => {
    const { start, end, text } = getSelectionInfo();
    if (!text) {
      showNotification('Highlight text to make it italic', 'info');
      return;
    }

    const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const italicChars = [
      "𝘈","𝘉","𝘊","𝘎","𝘌","𝘍","𝘎","𝘏","𝘐","𝘑","𝘒","𝘓","𝘔","𝘕","𝘖","𝘗","𝘘","𝘙","𝘚","𝘛","𝘜","𝘝","𝘞","𝘟","𝘠","𝘡",
      "𝘢","𝘣","𝘤","𝘥","𝘦","𝘧","𝘨","𝘩","𝘪","𝘫","𝗸","𝘭","𝗺","𝗻","𝗼","𝗽","𝘲","𝘳","𝘴","𝘁","𝘂","𝘷","𝘸","𝘹","𝘺","𝘻",
      "0","1","2","3","4","5","6","7","8","9"
    ];

    const formatted = text.split('').map(c => {
      const idx = normal.indexOf(c);
      return idx > -1 ? italicChars[idx] : c;
    }).join('');

    const updatedText = content.slice(0, start) + formatted + content.slice(end);
    applyTextChange(updatedText, start + formatted.length);
  };

  const handleFormatList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const beforeText = content.slice(0, start);
    const lastNewlineIdx = beforeText.lastIndexOf('\n');
    const insertIdx = lastNewlineIdx === -1 ? 0 : lastNewlineIdx + 1;
    
    const updatedText = content.slice(0, insertIdx) + '• ' + content.slice(insertIdx);
    applyTextChange(updatedText, start + 2);
  };

  const handleInsertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    const start = textarea ? textarea.selectionStart : content.length;
    const end = textarea ? textarea.selectionEnd : content.length;
    
    const updatedText = content.slice(0, start) + emoji + content.slice(end);
    applyTextChange(updatedText, start + emoji.length);
    setEmojiOpen(false);
  };

  const handlePost = async () => {
    if (!content.trim()) {
      showNotification('Please enter post content', 'error');
      return;
    }

    if (platforms.length === 0) {
      showNotification('Please select at least one platform', 'error');
      return;
    }

    if (!postNow && !scheduledAt) {
      showNotification('Please select a scheduled date and time', 'error');
      return;
    }

    if (!postNow && scheduledAt) {
      const scheduledDate = new Date(scheduledAt);
      if (scheduledDate <= new Date()) {
        showNotification('Scheduled time must be in the future', 'error');
        return;
      }
    }

    setLoading(true);

    try {
      if (postNow) {
        await apiService.createScheduledPost({
          content: content.trim(),
          scheduledAt: new Date().toISOString(),
          platforms,
          mediaUrl: mediaUrl.trim() || null,
          mediaType: mediaUrl.trim() ? mediaType : null,
          type: 'immediate'
        });

        showNotification('Post published successfully!', 'success');
        
        // Reset form
        setContent('');
        setPlatforms([]);
        setScheduledAt('');
        setMediaUrl('');
        setMediaType('image');
        setUploadedFileName('');
        setUploadMode('url');
        setPostNow(true);

        if (onSuccess) {
          onSuccess();
        }
      } else {
        const scheduledDate = new Date(scheduledAt);
        await apiService.createScheduledPost({
          content: content.trim(),
          scheduledAt: scheduledDate.toISOString(),
          platforms,
          mediaUrl: mediaUrl.trim() || null,
          mediaType: mediaUrl.trim() ? mediaType : null,
          type: 'manual'
        });

        showNotification('Post scheduled successfully!', 'success');
        
        // Reset form
        setContent('');
        setPlatforms([]);
        setScheduledAt('');
        setMediaUrl('');
        setMediaType('image');
        setUploadedFileName('');
        setUploadMode('url');
        setPostNow(true);

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Failed to schedule post:', error);
      const errorMsg = error.message || 'Failed to schedule post. Please try again.';
      showNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const availablePlatforms = [
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-[#0077b5]', border: 'border-[#0077b5]', text: 'text-[#0077b5]', icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
      </svg>
    )},
    { id: 'twitter', name: 'Twitter / X', color: 'bg-slate-900', border: 'border-slate-900', text: 'text-slate-900', icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )},
    { id: 'facebook', name: 'Facebook', color: 'bg-[#1877F2]', border: 'border-[#1877F2]', text: 'text-[#1877F2]', icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
      </svg>
    )}
  ];

  return (
    <div className="bg-white px-6 py-6 space-y-6">
      {/* Inline Notification */}
      {notification.show && (
        <div className={`p-4 rounded-xl border text-sm font-semibold flex items-center gap-2 ${
          notification.type === 'error' 
            ? 'bg-rose-50 border-rose-150 text-rose-800' 
            : notification.type === 'warning'
            ? 'bg-amber-50 border-amber-150 text-amber-800'
            : 'bg-indigo-50 border-indigo-150 text-indigo-800'
        }`}>
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Editor & Toolbar Section */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Post Composer
        </label>
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
          {/* Format Toolbar */}
          <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleFormatBold}
                title="Format Selection as Bold"
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 font-bold transition-all text-sm w-8 h-8 flex items-center justify-center bg-white border border-slate-200"
              >
                B
              </button>
              <button
                type="button"
                onClick={handleFormatItalic}
                title="Format Selection as Italic"
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 italic transition-all text-sm w-8 h-8 flex items-center justify-center bg-white border border-slate-200"
              >
                I
              </button>
              <button
                type="button"
                onClick={handleFormatList}
                title="Insert Bullet List Item"
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 transition-all text-sm w-8 h-8 flex items-center justify-center bg-white border border-slate-200 font-semibold"
              >
                •
              </button>
              
              {/* Emoji Picker Popover Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setEmojiOpen(!emojiOpen)}
                  title="Insert Emoji"
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 transition-all text-sm w-8 h-8 flex items-center justify-center bg-white border border-slate-200"
                >
                  😊
                </button>
                {emojiOpen && (
                  <div className="absolute left-0 mt-1 z-20 bg-white border border-slate-200 rounded-xl shadow-xl p-3 w-64 animate-in fade-in slide-in-from-top-1 duration-100">
                    <div className="grid grid-cols-6 gap-2">
                      {popularEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleInsertEmoji(emoji)}
                          className="w-8 h-8 text-lg flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setContent('')}
              className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors"
            >
              Clear Content
            </button>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            className="w-full min-h-[180px] p-4 focus:outline-none text-slate-800 placeholder-slate-400 text-sm font-medium resize-y bg-white"
            placeholder="What would you like to share? Select text to apply bold or italic styles..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
            <span>Unicode rich text formatting enabled</span>
            <span className="font-semibold">{content.length} characters</span>
          </div>
        </div>
      </div>

      {/* Asset Media Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Media Attachment
          </label>
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                uploadMode === 'url' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Paste URL
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                uploadMode === 'file' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Upload File
            </button>
          </div>
        </div>

        {uploadMode === 'url' ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Paste image/video link (e.g., https://example.com/image.png)"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 text-sm font-medium transition-all"
            />
            
            {mediaUrl.trim() && (
              <div className="flex gap-2 items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="mediaType"
                    checked={mediaType === 'image'}
                    onChange={() => setMediaType('image')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  Image
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="mediaType"
                    checked={mediaType === 'video'}
                    onChange={() => setMediaType('video')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  Video
                </label>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center w-full">
              <label 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-slate-50/50 transition-colors border-slate-200 bg-slate-50/20"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploadingFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full border-3 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                      <p className="text-xs text-indigo-600 font-bold">Uploading file...</p>
                    </div>
                  ) : uploadedFileName ? (
                    <div className="flex flex-col items-center gap-1">
                      <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs text-slate-700 font-semibold max-w-[250px] truncate">{uploadedFileName}</p>
                      <p className="text-[10px] text-slate-400">Click or drag new file to replace</p>
                    </div>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                      <p className="text-xs text-slate-500 font-semibold">
                        <span className="text-indigo-600 hover:underline">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">Image (max 5MB) or Video (max 25MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  disabled={uploadingFile}
                />
              </label>
            </div>
          </div>
        )}

        {/* Media Preview container */}
        {mediaUrl.trim() && (
          <div className="border border-slate-150 bg-slate-50 p-2 rounded-xl max-w-sm relative">
            <button
              onClick={() => {
                setMediaUrl('');
                setUploadedFileName('');
              }}
              className="absolute top-4 right-4 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full p-1.5 transition-colors z-10"
              title="Remove attachment"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {mediaType === 'video' ? (
              <video 
                src={mediaUrl} 
                className="w-full h-48 object-cover rounded-lg" 
                controls
              />
            ) : (
              <img 
                src={mediaUrl} 
                alt="Asset Attachment Preview" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=400&h=200&q=80';
                }}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>
        )}
      </div>

      {/* Platform selection */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Target Channels
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {availablePlatforms.map((platform) => {
            const isConnected = socialConnections[platform.id];
            const isSelected = platforms.includes(platform.id);

            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => handlePlatformToggle(platform.id)}
                disabled={!isConnected}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 group relative ${
                  !isConnected 
                    ? 'border-dashed border-slate-200 opacity-50 cursor-not-allowed bg-slate-50' 
                    : isSelected 
                    ? `border-transparent ring-2 ring-indigo-500 bg-indigo-50/40`
                    : 'border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className={`p-2 rounded-lg ${
                    isSelected ? `${platform.color} text-white` : 'bg-slate-100 text-slate-500'
                  } transition-colors`}>
                    {platform.icon}
                  </span>
                  
                  {isConnected && (
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ${
                      isSelected ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}>
                      ✓
                    </span>
                  )}
                </div>
                
                <div className="mt-4">
                  <span className="block font-bold text-slate-900 text-sm">
                    {platform.name}
                  </span>
                  <span className="block text-xs text-slate-400 mt-0.5">
                    {isConnected ? 'Account Connected' : 'Not Connected'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Plan limit Alert */}
      {userPlan && !postNow && (
        <div className="flex gap-2.5 items-start p-4 bg-slate-50 border border-slate-150 rounded-xl text-slate-700 text-xs sm:text-sm">
          <svg className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            Your weekly schedule limit is <span className="font-bold text-slate-900">{userPlan.postsPerWeek} posts</span>.
            {userPlan.remainingPosts > 0 ? (
              <span> You have <span className="font-bold text-slate-900">{userPlan.remainingPosts} remaining</span> scheduled posts for this cycle.</span>
            ) : (
              <span className="text-rose-600 font-bold block mt-0.5">You have consumed all posting slots for this cycle.</span>
            )}
          </div>
        </div>
      )}

      {/* Schedule toggle & Date selection */}
      <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-4 shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-bold text-slate-700">Schedule this post for later</span>
          </div>
          
          {/* Custom Toggle Switch */}
          <button
            type="button"
            onClick={handleScheduleToggle}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              !postNow ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                !postNow ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {!postNow && (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Schedule Date & Time
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 text-sm font-semibold transition-all"
            />
            <span className="text-xs text-slate-400 block mt-1">
              Select exactly when this post should be dispatched to your target channels.
            </span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => {
            setContent('');
            setPlatforms([]);
            setScheduledAt('');
            setMediaUrl('');
            setPostNow(true);
          }}
          disabled={loading}
          className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Reset Form
        </button>
        <button
          type="button"
          onClick={handlePost}
          disabled={loading || content.trim().length === 0 || platforms.length === 0}
          className={`inline-flex items-center gap-2 justify-center px-5 py-2.5 rounded-lg text-white font-bold text-sm shadow transition-all active:scale-[0.98] ${
            content.trim().length === 0 || platforms.length === 0
              ? 'bg-slate-300 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
          ) : postNow ? (
            'Publish Now'
          ) : (
            'Schedule Post'
          )}
        </button>
      </div>
    </div>
  );
};

export default PostComposer;
