from PIL import Image
import os

img_path = r"C:\Users\Lenovo\.gemini\antigravity\brain\5000d310-c431-4960-b4ea-02d52b529295\app_icon_v5_genie_mascot_1773572861171.png"
public_dir = r"d:\StudyGenie\public"

os.makedirs(public_dir, exist_ok=True)

try:
    img = Image.open(img_path)

    # Save as .ico with standard sizes
    img.save(os.path.join(public_dir, "favicon.ico"), format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])

    print("Favicon.ico created successfully in public dir!")
except Exception as e:
    print(f"Failed to create favicon: {e}")
