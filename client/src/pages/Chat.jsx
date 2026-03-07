import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Hash, Users, Circle, MessageSquare, Search,
  Paperclip, X, Trash2, FileText, Download, Image
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/ui/PageTransition';
import { uploadChatFile } from '../utils/api';
import toast from 'react-hot-toast';

const defaultRooms = [
  { id: 'general', name: 'General', desc: 'Open discussion for everyone' },
  { id: 'web-dev', name: 'Web Development', desc: 'Frontend & Backend topics' },
  { id: 'data-science', name: 'Data Science', desc: 'ML, AI & Data topics' },
  { id: 'ui-ux', name: 'UI/UX Design', desc: 'Design discussions' },
  { id: 'help', name: 'Help & Support', desc: 'Get help from the community' },
];

const isImageFile = (type) => type && type.startsWith('image/');

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const BASE_URL = '';

const Chat = () => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [currentRoom, setCurrentRoom] = useState('general');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit('joinRoom', currentRoom);

    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleRoomMessages = (history) => {
      setMessages(history);
    };

    const handleTyping = ({ user: typingUser }) => {
      setTypingUsers((prev) => {
        if (prev.find((u) => u._id === typingUser._id)) return prev;
        return [...prev, typingUser];
      });
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u._id !== typingUser._id));
      }, 3000);
    };

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    socket.on('newMessage', handleMessage);
    socket.on('roomMessages', handleRoomMessages);
    socket.on('userTyping', handleTyping);
    socket.on('messageDeleted', handleMessageDeleted);

    return () => {
      socket.emit('leaveRoom', currentRoom);
      socket.off('newMessage', handleMessage);
      socket.off('roomMessages', handleRoomMessages);
      socket.off('userTyping', handleTyping);
      socket.off('messageDeleted', handleMessageDeleted);
    };
  }, [socket, currentRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const switchRoom = (roomId) => {
    if (socket && currentRoom !== roomId) {
      socket.emit('leaveRoom', currentRoom);
      setMessages([]);
      setTypingUsers([]);
      setCurrentRoom(roomId);
      setSidebarOpen(false);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    socket.emit('sendMessage', { content: input.trim(), room: currentRoom });
    setInput('');
  };

  const handleTypingEvent = () => {
    if (!socket) return;
    socket.emit('typing', { room: currentRoom });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { room: currentRoom });
    }, 3000);
  };

  const handleDeleteMessage = (messageId) => {
    if (!socket) return;
    socket.emit('deleteMessage', { messageId, room: currentRoom });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await uploadChatFile(formData);

      socket.emit('sendMessage', {
        room: currentRoom,
        content: file.name,
        type: 'file',
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileType: data.fileType,
        fileSize: data.fileSize,
      });
    } catch (err) {
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const currentRoomData = defaultRooms.find((r) => r.id === currentRoom);

  return (
    <PageTransition>
      <div className="flex h-[calc(100vh-8rem)] lg:h-[calc(100vh-10rem)] rounded-2xl overflow-hidden border border-white/[0.04] relative">
        {/* Mobile backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-10 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar — Room list */}
        <div
          className={`bg-dark-800/50 border-r border-white/[0.04] flex flex-col overflow-hidden
            fixed lg:relative z-20 h-full w-[280px] top-0 left-0
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <div className="p-4 border-b border-white/[0.04]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary-400" />
                Chat Rooms
              </h2>
              <button className="lg:hidden p-1 rounded-lg hover:bg-white/5" onClick={() => setSidebarOpen(false)}>
                <X className="w-4 h-4 text-white/40" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                <input className="glass-input !py-1.5 pl-8 text-xs w-full" placeholder="Search rooms..." />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {defaultRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => switchRoom(room.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  currentRoom === room.id
                    ? 'bg-primary-500/10 text-white'
                    : 'text-white/40 hover:bg-white/[0.03] hover:text-white/60'
                }`}
              >
                <Hash className={`w-4 h-4 flex-shrink-0 ${currentRoom === room.id ? 'text-primary-400' : ''}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{room.name}</p>
                  <p className="text-[10px] text-white/20 truncate">{room.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Online users */}
          <div className="p-4 border-t border-white/[0.04]">
            <p className="text-[10px] text-white/20 uppercase tracking-wider mb-2">
              Online — {onlineUsers?.length || 0}
            </p>
            <div className="space-y-1.5 max-h-24 overflow-y-auto">
              {(onlineUsers || []).slice(0, 8).map((u, idx) => (
                <div key={u._id || idx} className="flex items-center gap-2 text-xs text-white/30">
                  <Circle className="w-2 h-2 text-emerald-400 fill-emerald-400" />
                  <span className="truncate">{u.name || 'User'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-dark-900/50 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-3 sm:px-5 py-3 border-b border-white/[0.04]">
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="lg:hidden p-1.5 rounded-lg hover:bg-white/5" onClick={() => setSidebarOpen(true)}>
                <MessageSquare className="w-4 h-4 text-white/40" />
              </button>
              <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white truncate">{currentRoomData?.name}</h3>
                <p className="text-[10px] text-white/30 truncate hidden sm:block">{currentRoomData?.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition">
                <Users className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-3 sm:space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-white/5 mx-auto mb-3" />
                  <p className="text-white/20 text-sm">No messages yet</p>
                  <p className="text-white/10 text-xs">Be the first to say something!</p>
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const isOwn = msg.sender?._id === user?._id;
              const canDelete = isOwn || user?.role === 'admin';
              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-2 sm:gap-3 group ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  <div className="avatar text-[10px] w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
                    {msg.sender?.name?.charAt(0) || '?'}
                  </div>
                  <div className={`max-w-[85%] sm:max-w-[70%] min-w-0 ${isOwn ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'justify-end' : ''}`}>
                      <span className="text-xs font-medium text-white/60 truncate">{msg.sender?.name || 'Unknown'}</span>
                      <span className="text-[10px] text-white/15 flex-shrink-0">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="sm:opacity-0 sm:group-hover:opacity-100 p-0.5 rounded hover:bg-red-500/10 text-white/15 hover:text-red-400 transition flex-shrink-0"
                          title="Delete message"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* File message */}
                    {msg.type === 'file' && msg.fileUrl ? (
                      <div className={`inline-block rounded-2xl overflow-hidden ${
                        isOwn ? 'bg-primary-500/20 rounded-br-sm' : 'bg-white/[0.04] rounded-bl-sm'
                      }`}>
                        {isImageFile(msg.fileType) ? (
                          <div className="max-w-[240px] sm:max-w-[300px]">
                            <img
                              src={`${BASE_URL}${msg.fileUrl}`}
                              alt={msg.fileName}
                              className="w-full rounded-t-2xl cursor-pointer"
                              onClick={() => window.open(`${BASE_URL}${msg.fileUrl}`, '_blank')}
                            />
                            <div className="px-3 py-2 flex items-center justify-between gap-2">
                              <span className="text-[11px] text-white/40 truncate">{msg.fileName}</span>
                              <a
                                href={`${BASE_URL}${msg.fileUrl}`}
                                download={msg.fileName}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/30 hover:text-white/60 flex-shrink-0"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <a
                            href={`${BASE_URL}${msg.fileUrl}`}
                            download={msg.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition"
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-primary-400" />
                            </div>
                            <div className="min-w-0 text-left">
                              <p className="text-sm text-white/70 truncate">{msg.fileName}</p>
                              <p className="text-[10px] text-white/25">{formatFileSize(msg.fileSize)}</p>
                            </div>
                            <Download className="w-4 h-4 text-white/20 flex-shrink-0" />
                          </a>
                        )}
                      </div>
                    ) : (
                      /* Text message */
                      <div className={`inline-block px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                        isOwn
                          ? 'bg-primary-500 text-white rounded-br-sm'
                          : 'bg-white/[0.04] text-white/70 rounded-bl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-xs text-white/30"
              >
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" />
                </div>
                <span>{typingUsers.map((u) => u.name).join(', ')} typing...</span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 sm:px-5 py-3 sm:py-4 border-t border-white/[0.04]">
            <form onSubmit={sendMessage} className="flex items-center gap-2 sm:gap-3">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.mp4,.mp3"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="p-2 rounded-xl hover:bg-white/5 text-white/20 hover:text-white/40 transition disabled:opacity-30 flex-shrink-0"
              >
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-primary-400 rounded-full animate-spin" />
                ) : (
                  <Paperclip className="w-5 h-5" />
                )}
              </button>
              <div className="flex-1 relative min-w-0">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); handleTypingEvent(); }}
                  placeholder={`Message #${currentRoomData?.name || 'general'}...`}
                  className="glass-input w-full !py-2.5 sm:!py-3"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 sm:p-3 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition disabled:opacity-30 disabled:hover:bg-primary-500 flex-shrink-0"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Chat;
