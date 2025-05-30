
/*
import Tesseract from "tesseract.js";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ text: "파일 업로드 실패" });
    }

    const file = files.image?.[0] || files.image;
    if (!file || !file.filepath) {
      return res.status(400).json({ text: "이미지 파일이 없습니다" });
    }

    try {
      const result = await Tesseract.recognize(file.filepath, "eng+kor");
      res.status(200).json({ text: result.data.text });
    } catch (error) {
      res.status(500).json({ text: "OCR 실패" });
    }
  });
}
*/

import Tesseract from "tesseract.js";
import { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ text: "파일 업로드 실패" });
      return;
    }

    const file = files.image?.[0] || files.image;

    if (!file || !file.filepath) {
      res.status(400).json({ text: "이미지 파일이 없습니다." });
      return;
    }

    try {
      const result = await Tesseract.recognize(file.filepath, "eng+kor");
      res.status(200).json({ text: result.data.text });
    } catch (error) {
      console.error("OCR 처리 중 오류:", error);
      res.status(500).json({ text: "OCR 실패" });
    }
  });
}

