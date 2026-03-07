import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Hash, Users, Circle, MessageSquare, Plus, Search,
  Smile, Paperclip, MoreVertical, Phone, Video
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/ui/PageTransition';

const defaultRooms = [
  { id: 'general', name: 'General', desc: 'Open discussion for everyone' },
  { id: 'web-dev', name: 'Web Development', desc: 'Frontend & Backend topics' },
  { id: 'data-science', name: 'Data Science', desc: 'ML, AI & Data topics' },
  { id: 'ui-ux', name: 'UI/UX Design', desc: 'Design discussions' },
  { id: 'help', name: 'Help & Support', desc: 'Get help from the community' },
];

const Chat = () => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [currentRoom, setCurrentRoom] = useState('general');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

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

    socket.on('newMessage', handleMessage);
    socket.on('roomMessages', handleRoomMessages);
    socket.on('userTyping', handleTyping);

    return () => {
      socket.emit('leaveRoom', currentRoom);
      socket.off('newMessage', handleMessage);
      socket.off('roomMessages', handleRoomMessages);
      socket.off('userTyping', handleTyping);
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
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    socket.emit('sendMessage', { content: input.trim(), room: currentRoom });
    setInput('');
  };

  const handleTyping = () => {
    if (!socket) return;
    socket.emit('typing', { room: currentRoom });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { room: currentRoom });
    }, 3000);
  };

  const currentRoomData = defaultRooms.find((r) => r.id === currentRoom);

  return (
    <PageTransition>
      <div className="flex h-[calc(100vh-8rem)] lg:h-[calc(100vh-10rem)] rounded-2xl overflow-hidden border border-white/[0.04]">
        {/* Sidebar — Room list */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-dark-800/50 border-r border-white/[0.04] flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-white/[0.04]">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary-400" />
                  Chat Rooms
                </h2>
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
                  {(onlineUsers || []).slice(0, 5).map((u, idx) => (
                    <div key={u._id || idx} className="flex items-center gap-2 text-xs text-white/30">
                      <Circle className="w-2 h-2 text-emerald-400 fill-emerald-400" />
                      <span className="truncate">{u.name || 'User'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-dark-900/50">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.04]">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-1.5 rounded-lg hover:bg-white/5" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <MessageSquare className="w-4 h-4 text-white/40" />
              </button>
              <Hash className="w-5 h-5 text-primary-400" />
              <div>
                <h3 className="text-sm font-semibold text-white">{currentRoomData?.name}</h3>
                <p className="text-[10px] text-white/30">{currentRoomData?.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition">
                <Users className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-white/5 mx-auto mb-3" />
                  <p className="text-white/20 text-sm">No messages yet</p>
                  <p className="text-white/10 text-xs">Be the first to say something!</p>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => {
              const isOwn = msg.sender?._id === user?._id;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  <div className="avatar text-[10px] w-8 h-8 flex-shrink-0">
                    {msg.sender?.name?.charAt(0) || '?'}
                  </div>
                  <div className={`max-w-[70%] ${isOwn ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'justify-end' : ''}`}>
                      <span className="text-xs font-medium text-white/60">{msg.sender?.name || 'Unknown'}</span>
                      <span className="text-[10px] text-white/15">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`inline-block px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isOwn
                        ? 'bg-primary-500 text-white rounded-br-sm'
                        : 'bg-white/[0.04] text-white/70 rounded-bl-sm'
                    }`}>
                      {msg.content}
                    </div>
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
          <div className="px-5 py-4 border-t border-white/[0.04]">
            <form onSubmit={sendMessage} className="flex items-center gap-3">
              <button type="button" className="p-2 rounded-xl hover:bg-white/5 text-white/20 hover:text-white/40 transition">
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); handleTyping(); }}
                  placeholder={`Message #${currentRoomData?.name || 'general'}...`}
                  className="glass-input w-full !py-3 pr-12"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-3 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition disabled:opacity-30 disabled:hover:bg-primary-500"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Chat;
