"use client";

import React, { useState } from "react";

export default function ImageTextExtractor() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      extractText(file);
    }
  };

  const extractText = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setText(result.text || "텍스트를 추출하지 못했습니다.");
    } catch (error) {
      setText("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "extracted_text.txt";
    link.click();
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">이미지에서 텍스트 추출</h1>

<label
  htmlFor="file-upload"
  className="inline-block px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 cursor-pointer"
>
  파일 선택
</label>
<input
  id="file-upload"
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  className="hidden"
/>

      {image && <img src={image} alt="업로드된 이미지" className="max-w-xs rounded shadow" />}
      {loading ? (
        <p>텍스트를 추출 중입니다...</p>
      ) : (
        text && (
          <div className="mt-4 p-4 bg-gray-100 rounded space-y-2">
            <h2 className="font-semibold">추출된 텍스트:</h2>
            <p>{text}</p>
            <button
              onClick={downloadText}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              텍스트 다운로드
            </button>
          </div>
        )
      )}
    </div>
  );
}
