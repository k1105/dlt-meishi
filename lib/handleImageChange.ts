export const handleImageChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setPreview: (url: string) => void
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = document.createElement("img");

    img.onload = () => {
      // ここにリサイズ処理
      const maxSize = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);

        // **ここが重要！JPEG圧縮**
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        console.log("圧縮後の画像サイズ:", dataUrl.length / 1024, "KB");

        setPreview(dataUrl);
      }
    };

    img.src = reader.result as string;
  };

  reader.readAsDataURL(file);
};
