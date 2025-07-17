// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Send, Bot, User as UserIcon, Loader } from 'lucide-react';
// import { supabase } from '../lib/supabase';
// import toast from 'react-hot-toast';

// interface Message {
//   id: string;
//   message: string;
//   is_ai_response: boolean;
//   created_at: string;
// }

// const Chat = () => {
//   const navigate = useNavigate();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSending, setIsSending] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     loadMessages();
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const loadMessages = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) {
//         navigate('/login');
//         return;
//       }

//       const { data, error } = await supabase
//         .from('chat_messages')
//         .select('*')
//         .eq('user_id', user.id)
//         .order('created_at', { ascending: true });

//       if (error) throw error;
//       setMessages(data || []);
//     } catch (error) {
//       toast.error('Error loading messages');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || isSending) return;

//     setIsSending(true);
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error('Not authenticated');

//       // Insert user message
//       const { data: userMessage, error: userError } = await supabase
//         .from('chat_messages')
//         .insert({
//           user_id: user.id,
//           message: newMessage,
//           is_ai_response: false
//         })
//         .select()
//         .single();

//       if (userError) throw userError;

//       // Update messages immediately with user's message
//       setMessages(prev => [...prev, userMessage]);
//       setNewMessage('');

//       // Get AI response
//       const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

//       const response = await fetch(functionUrl, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           messages: [...messages, userMessage].map(msg => ({
//             message: msg.message,
//             is_ai_response: msg.is_ai_response
//           })),
//           userId: user.id
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
//       }

//       const { message: aiResponse, error: aiError } = await response.json();

//       if (aiError) throw new Error(aiError);

//       // Insert AI response
//       const { data: aiMessage, error: aiInsertError } = await supabase
//         .from('chat_messages')
//         .insert({
//           user_id: user.id,
//           message: aiResponse,
//           is_ai_response: true
//         })
//         .select()
//         .single();

//       if (aiInsertError) throw aiInsertError;

//       // Update messages with AI response
//       setMessages(prev => [...prev, aiMessage]);
//     } catch (error) {
//       console.error('Chat error:', error);
//       toast.error(error.message || 'Error sending message');
//       // Re-enable the input field even if there's an error
//       setIsSending(false);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const formatTime = (dateString: string) => {
//     return new Date(dateString).toLocaleTimeString('en-US', {
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader className="h-8 w-8 animate-spin text-rose-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="p-4 bg-rose-500 text-white">
//           <div className="flex items-center space-x-2">
//             <Bot className="h-6 w-6" />
//             <h2 className="text-xl font-semibold">EQ Coach</h2>
//           </div>
//           <p className="text-rose-100 text-sm mt-1">
//             Your personal emotional intelligence coach
//           </p>
//         </div>

//         <div className="h-[500px] flex flex-col">
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {messages.length === 0 ? (
//               <div className="text-center text-gray-500 mt-8">
//                 <Bot className="h-12 w-12 mx-auto mb-3 text-gray-400" />
//                 <p>Start your conversation with the EQ Coach</p>
//                 <p className="text-sm mt-2">
//                   Ask about emotional intelligence, relationship advice, or personal growth
//                 </p>
//               </div>
//             ) : (
//               messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex ${message.is_ai_response ? 'justify-start' : 'justify-end'}`}
//                 >
//                   <div
//                     className={`flex items-start space-x-2 max-w-[80%] ${
//                       message.is_ai_response ? 'flex-row' : 'flex-row-reverse'
//                     }`}
//                   >
//                     <div
//                       className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                         message.is_ai_response ? 'bg-rose-100' : 'bg-gray-100'
//                       }`}
//                     >
//                       {message.is_ai_response ? (
//                         <Bot className="h-5 w-5 text-rose-500" />
//                       ) : (
//                         <UserIcon className="h-5 w-5 text-gray-500" />
//                       )}
//                     </div>
//                     <div
//                       className={`rounded-lg p-3 ${
//                         message.is_ai_response
//                           ? 'bg-rose-50 text-gray-800'
//                           : 'bg-rose-500 text-white'
//                       }`}
//                     >
//                       <p className="text-sm">{message.message}</p>
//                       <p
//                         className={`text-xs mt-1 ${
//                           message.is_ai_response ? 'text-gray-500' : 'text-rose-100'
//                         }`}
//                       >
//                         {formatTime(message.created_at)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           <form onSubmit={handleSubmit} className="p-4 border-t">
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="Type your message..."
//                 className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
//                 disabled={isSending}
//               />
//               <button
//                 type="submit"
//                 disabled={isSending || !newMessage.trim()}
//                 className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSending ? (
//                   <Loader className="h-5 w-5 animate-spin" />
//                 ) : (
//                   <Send className="h-5 w-5" />
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User as UserIcon, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Message } from '../interfaces/interfaces';
import toast from 'react-hot-toast';

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const loadMessages = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return navigate('/login');

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch {
      toast.error('Error loading messages');
    } finally {
      setIsLoading(false);
    }
  };

  const sendUserMessage = async (userId: string, text: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ user_id: userId, message: text, is_ai_response: false })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const getAIResponse = async (userId: string, messageList: Message[]) => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        messages: messageList.map(({ message, is_ai_response }) => ({
          message,
          is_ai_response,
        })),
      }),
    });

    const { message, error } = await response.json();
    if (!response.ok || error) throw new Error(error || 'AI response error');

    return message;
  };

  const insertAIResponse = async (userId: string, text: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ user_id: userId, message: text, is_ai_response: true })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const userMsg = await sendUserMessage(user.id, newMessage);
      setMessages((prev) => [...prev, userMsg]);
      setNewMessage('');

      const aiText = await getAIResponse(user.id, [...messages, userMsg]);
      const aiMsg = await insertAIResponse(user.id, aiText);
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        toast.error(err.message || 'Error sending message');
      } else {
        console.error(err);
        toast.error('Error sending message');
      }
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader className='h-8 w-8 animate-spin text-rose-500' />
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='bg-white rounded-xl shadow-md overflow-hidden'>
        <div className='p-4 bg-rose-500 text-white'>
          <div className='flex items-center space-x-2'>
            <Bot className='h-6 w-6' />
            <h2 className='text-xl font-semibold'>EQ Coach</h2>
          </div>
          <p className='text-sm mt-1 text-rose-100'>
            Your personal emotional intelligence coach
          </p>
        </div>

        <div className='h-[500px] flex flex-col'>
          <div className='flex-1 overflow-y-auto p-4 space-y-4'>
            {messages.length === 0 ? (
              <div className='text-center text-gray-500 mt-8'>
                <Bot className='h-12 w-12 mx-auto mb-3 text-gray-400' />
                <p>Start your conversation with the EQ Coach</p>
                <p className='text-sm mt-2'>
                  Ask about emotional intelligence, relationship advice, or
                  personal growth
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.is_ai_response ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      msg.is_ai_response ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.is_ai_response ? 'bg-rose-100' : 'bg-gray-100'
                      }`}
                    >
                      {msg.is_ai_response ? (
                        <Bot className='h-5 w-5 text-rose-500' />
                      ) : (
                        <UserIcon className='h-5 w-5 text-gray-500' />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        msg.is_ai_response
                          ? 'bg-rose-50 text-gray-800'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      <p className='text-sm'>{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.is_ai_response ? 'text-gray-500' : 'text-rose-100'
                        }`}
                      >
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className='p-4 border-t'>
            <div className='flex space-x-2'>
              <input
                type='text'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder='Type your message...'
                disabled={isSending}
                className='flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500'
              />
              <button
                type='submit'
                disabled={isSending || !newMessage.trim()}
                className='bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSending ? (
                  <Loader className='h-5 w-5 animate-spin' />
                ) : (
                  <Send className='h-5 w-5' />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
