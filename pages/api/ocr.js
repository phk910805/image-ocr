import { createWorker } from "tesseract.js";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new IncomingForm({ keepExtensions: true, uploadDir: "/tmp" });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ text: "파일 업로드 실패" });

    const file = files.image?.[0] || files.image;
    if (!file || !file.filepath)
      return res.status(400).json({ text: "이미지 파일이 없습니다." });

    try {
      const worker = await createWorker({
      corePath: "/tesseract-core-simd.wasm", // ✅ public 폴더 기준
      langPath: "/tessdata",                 // ✅ public 폴더 기준
    });

      await worker.load();
      await worker.loadLanguage("eng+kor");
      await worker.initialize("eng+kor");

      const { data } = await worker.recognize(file.filepath);
      await worker.terminate();

      return res.status(200).json({ text: data.text });
    } catch (error) {
      console.error("OCR 처리 중 오류:", error);
      return res.status(500).json({ text: "OCR 실패", error: error.message });
    }
  });
}


