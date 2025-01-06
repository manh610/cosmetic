import { useState, useRef, useEffect } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, AttachmentButton, Avatar } from '@chatscope/chat-ui-kit-react';
import "./chat.css";
import { FaCamera, FaComments } from "react-icons/fa6";
import { Modal } from 'antd';
import axios from 'axios';
import SkinTypeService from '../app/service/skinType.service';
import ProductService from '../app/service/product.service';

// const API_KEY = "AIzaSyAFBHt4iSj-_RCY2JWJB6rIWiFsnevQ6TQ";

const API_KEY = "";

const systemMessage = {
  "role": "user", "content": "Trả lời bằng tiếng việt."
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const processMessageToChatGPTWithRetry = async (chatMessages, maxRetries = 3) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      let apiMessages = chatMessages.map((messageObject) => {
        let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
        let parts = [{ text: messageObject.message }];

        if (messageObject.image) {
          parts.push({
            inlineData: {
              mimeType: "image/jpeg",
              data: messageObject.image,
            },
          });
        }

        return { role: role, content: messageObject.message };
      });

      const apiRequestBody = {
        "model": "gpt-3.5-turbo",
        messages: [
          systemMessage,
          ...apiMessages,
        ],
      };

      const response = await fetch(
        `https://api.openai.com/v1/chat/completions`,
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody),
        }
      );

      const data = await response.json();

      if (response.status === 429) {
        console.log(`Rate limit hit, waiting before retry attempt ${attempt + 1}`);
        await delay(60000); // đợi 60 giây
        continue;
      }

      if (!response.ok) {
        const errorMessage = data.error?.message || "An unknown error occurred.";
        throw new Error(errorMessage);
      }

      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content;
      }

    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
      console.log(`Attempt ${attempt + 1} failed, retrying...`);
      await delay(2000); // đợi 2 giây trước khi thử lại
    }
  }
  throw new Error("Max retries reached");
};

function Chat() {
  const [messages, setMessages] = useState([
    {
      message: "Xin chào, tôi có thể giúp gì cho bạn.",
      sentTime: "just now",
      sender: "ChatGPT",
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

  const [isOpen, setIsOpen] = useState(false);

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
    handlePredictImage(base64Image);

  };

  const handlePredictImage = async (image) => {
    try {
      setIsTyping(true);
      const payload = {
        "image": image,
      }
      const res = await axios.post("http://14.224.131.219:8009/predict", payload);
      console.log(res.data);
      // const listSkinType = [
      //   {
      //     "id": 1,
      //     "name": "Dry",
      //   },
      //   {
      //     "id": 2,
      //     "name": "Normal",
      //   },
      //   {
      //     "id": 3,
      //     "name": "Oily",
      //   },
      // ]
      const resListSkinType = await SkinTypeService.search();
      const listSkinType = resListSkinType.data;
      console.log(listSkinType);
      if (res.status === 200) {
        const skinType = listSkinType.find(type => type.description === res.data.skin_type);
        if (skinType) {
          // Thông báo loại da
          const skinTypeMessage = {
            message: `Dựa trên hình ảnh, loại da của bạn là: ${skinType.name}`,
            direction: "incoming", 
            sender: "system",
            sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prevMessages) => [...prevMessages, skinTypeMessage]);

          // Lấy list sản phẩm
          const resListProduct = await ProductService.search({
            skinTypeId: skinType.id,
            pageIndex: 1,
            pageSize: 3,
          });
          const listProduct = resListProduct.data;

          // Tạo prompt cho ChatGPT
          const productPrompt = `Hãy phân tích và đề xuất 3 sản phẩm phù hợp nhất từ danh sách sau:
            ${listProduct.map(product => `
              - ID: ${product.id}
              - Tên: ${product.name}
              - Loại sản phẩm: ${product.categoryName}
              - Mô tả: ${product.description}
              - Giá: ${product.minPrice}
            `).join('\n')}
            
            Chỉ nói ra 3 sản phẩm phù hợp nhất`;

          try {
            const ChatGPTResponse = await processMessageToChatGPTWithRetry([
              {
                message: productPrompt,
                sender: "user",
                direction: "outgoing"
              }
            ]);

            // Hiển thị phản hồi từ ChatGPT
            const recommendationMessage = {
              message: ChatGPTResponse,
              direction: "incoming",
              sender: "ChatGPT",
              sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prevMessages) => [...prevMessages, recommendationMessage]);

            // Tìm sản phẩm được đề xuất trong danh sách
            const recommendedProducts = listProduct.slice(0, 3); // Lấy 3 sản phẩm đầu tiên

            // Tạo các tin nhắn chứa link cho từng sản phẩm
            const productLinkMessages = recommendedProducts.map((product) => ({
                message: `Xem chi tiết sản phẩm tại đây: <a href="http://localhost:3000/results/${product.id}" target="_blank">${product.name}</a>`,
                direction: "incoming",
                sender: "system",
                sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isHtml: true // Thêm flag để đánh dấu tin nhắn chứa HTML
            }));

            // Thêm các tin nhắn vào danh sách tin nhắn hiện tại
            setMessages((prevMessages) => [...prevMessages, ...productLinkMessages]);

          } catch (error) {
            console.error("Error getting ChatGPT response:", error);
            const errorMessage = {
              message: "Xin lỗi, hiện tại hệ thống đang bận. Vui lòng thử lại sau.",
              direction: "incoming",
              sender: "system",
              sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
          }
        }
      }
      setIsTyping(false);
    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    console.log("Image state updated:", image);
    if (image) {
      handlePredictImage(image.base64);
      setImage(null);
    }
  }, [image]);

  const handleSend = async (message) => {
    console.log("Send message:", message);

    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
      sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: image?.base64,
    };
    // handlePredictImage(image?.base64);
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);
    setImage(null); // Clear the image after sending

    try {
      await processMessageToChatGPT(newMessages);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        {
          message: "Sorry, I encountered an error. Please try again.",
          sender: "ChatGPT",
          direction: "incoming",
          sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      // let parts = [{ text: messageObject.message }];

      // if (messageObject.image) {
      //   parts.push({
      //     inlineData: {
      //       mimeType: "image/jpeg",
      //       data: messageObject.image,
      //     },
      //   });
      // }

      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...apiMessages,
      ],
    };

    const response = await fetch(
      `https://api.openai.com/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
      }
    );

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      const errorMessage = data.error?.message || "An unknown error occurred.";
      throw new Error(errorMessage);
    }

    if (
      data.choices &&
      data.choices.length > 0 &&
      data.choices[0].message
    ) {
      setMessages([
        ...chatMessages,
        {
          message: data.choices[0].message.content,
          sender: "ChatGPT",
          direction: "incoming",
          sentTime: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    } else {
      throw new Error("No valid response received from ChatGPT.");
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
    <>
      <button
        className="chat-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaComments size={24} />
      </button>

      <div className={`chat-popup ${isOpen ? 'open' : ''}`}>
        <MainContainer style={isModalOpen ? { display: 'none' } : { width: '100%', height: '100%' }}>
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
                    {message.isHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: message.message }} />
                    ) : (
                      message.message
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
    </>
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
