import { useState, useRef, useEffect } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, AttachmentButton, Avatar } from '@chatscope/chat-ui-kit-react';
import "./chat.css";
import { FaCamera } from "react-icons/fa6";
import { Modal } from 'antd';

const API_KEY = "";

const systemMessage = {
  "role": "user", "content": "Trả lời bằng tiếng việt."
}

function Chat() {
  const [messages, setMessages] = useState([
    {
      message: "Xin chào, tôi có thể giúp gì cho bạn.",
      sentTime: "just now",
      sender: "Gemini",
      direction: "incoming",
    }
  ]);
  const [textContent, setTextContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [image, setImage] = useState(null); // { base64: ..., file: ... }
  const fileInputRef = useRef(null);
  const [isInputReady, setIsInputReady] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageBase64, setImageBase64] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  const handleStartCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsModalOpen(true);  // Open the modal when camera starts
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Draw the video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the base64 encoded image from the canvas
    const base64Image = canvas.toDataURL('image/jpeg').split(",")[1];;
    setImageBase64(base64Image); // Store the base64 image
    const newMessage = {
        message: '',
        direction: "outgoing",
        sender: "user",
        sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        image: base64Image,
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    // Stop the camera and close the modal
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsModalOpen(false); // Close the modal
  };

  useEffect(() => {
    console.log("Image state updated:", image);
  }, [image]);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
      sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: image?.base64,
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);
    setImage(null); // Clear the image after sending

    try {
      await processMessageToGemini(newMessages);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        {
          message: "Sorry, I encountered an error. Please try again.",
          sender: "Gemini",
          direction: "incoming",
          sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }
  };

  async function processMessageToGemini(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "Gemini" ? "model" : "user";
      let parts = [{ text: messageObject.message }];

      if (messageObject.image) {
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: messageObject.image,
          },
        });
      }

      return { role, parts };
    });

    const apiRequestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: systemMessage.content }],
        },
        ...apiMessages,
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error?.message || "An unknown error occurred.";
      throw new Error(errorMessage);
    }

    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content
    ) {
      setMessages([
        ...chatMessages,
        {
          message: data.candidates[0].content.parts[0].text,
          sender: "Gemini",
          direction: "incoming",
          sentTime: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    } else {
      throw new Error("No valid response received from Gemini.");
    }

    setIsTyping(false);
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result.split(",")[1];
        setImage({ base64: base64Data, file: file }); // Store both base64 and file object
        const newMessage = {
            message: '',
            direction: "outgoing",
            sender: "user",
            sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            image: base64Data,
        };
    
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  useEffect(() => {
    if (fileInputRef.current) {
      setIsInputReady(true);
    }
  }, [fileInputRef]);

  return (
    <div className="App">
        
      <div style={{ display: 'flex', justifyContent: 'center', height: "700px" }}>
        <MainContainer style={ isModalOpen ? {display: 'none'} : { width: '900px' }}>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="Hệ thống đang xử lý" /> : null}
            >
              {messages.map((message, i) => {
                return (
                  <Message
                    key={i}
                    model={{
                      message: message.message,
                      sentTime: message.sentTime,
                      sender: message.sender,
                      direction: message.direction,
                      position: "single",
                    }}
                  >
                    {message.image && (
                      <Message.ImageContent src={`data:image/jpeg;base64,${message.image}`} width={200} />
                    )}
                  </Message>
                );
              })}
            </MessageList>
            <MessageInput
              placeholder="Type message here"
              onSend={(innerHtml, textContent) => handleSend(textContent)}
              disabled={isTyping}
              attachButton={true}
              onAttachClick={handleAttachClick}
            >
              <AttachmentButton onClick={handleAttachClick} disabled={!isInputReady} />
              
            </MessageInput>
          </ChatContainer>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <FaCamera onClick={handleStartCamera} />
        </MainContainer>
        
        <div style={isModalOpen ? modalStyle : modalHidden}>
            <div style={modalContentStyle}>
                <video ref={videoRef} width="400" height="300" autoPlay></video>
                <div>
                    <button onClick={handleCapture}>Capture Image</button>
                </div>
                <canvas ref={canvasRef} width="400" height="300" style={{ display: 'none' }}></canvas>
            </div>
        </div>
      </div>
    </div>
  );
}

const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const modalHidden = {
    display: 'none'
}

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    textAlign: 'center',
};

export default Chat;
