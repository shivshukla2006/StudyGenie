from PIL import Image
import os

img_path = r"C:\Users\Lenovo\.gemini\antigravity\brain\5000d310-c431-4960-b4ea-02d52b529295\app_icon_v5_genie_mascot_1773572861171.png"
public_dir = r"d:\StudyGenie\public"

os.makedirs(public_dir, exist_ok=True)

try:
    img = Image.open(img_path)

    # Save 192x192
    img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save(os.path.join(public_dir, "pwa-192x192.png"))

    # Save 512x512
    img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    img_512.save(os.path.join(public_dir, "pwa-512x512.png"))

    print("Approved Icons saved successfully to public dir!")
except Exception as e:
    print(f"Failed to resize image: {e}")
