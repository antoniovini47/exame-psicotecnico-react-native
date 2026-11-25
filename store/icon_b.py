from PIL import Image, ImageDraw, ImageFont
import os
S = os.path.dirname(os.path.abspath(__file__))
F = os.path.join(os.path.dirname(S), "node_modules/@expo-google-fonts/nunito")
font = lambda w, s: ImageFont.truetype(f"{F}/{w}/Nunito_{w}.ttf", s)
PETROL, YELLOW, CREAM, GREEN = "#0E3B43", "#FFC93C", "#FFFBEF", "#2EA35A"
N = 2048
img = Image.new("RGBA", (N, N), YELLOW)
d = ImageDraw.Draw(img)
card = (300, 560, 1748, 1488)
d.rounded_rectangle(card, radius=120, fill=PETROL)
d.rounded_rectangle((420, 700, 820, 1180), radius=60, fill=CREAM)
d.ellipse((540, 760, 700, 920), fill=PETROL)
d.rounded_rectangle((480, 950, 760, 1130), radius=80, fill=PETROL)
d.text((1300, 860), "CNH", font=font("900Black", 330), fill=YELLOW, anchor="mm")
for y in (1090, 1210):
    d.rounded_rectangle((960, y, 1640, y + 60), radius=30, fill="#2F6670")
cx, cy, r = 1640, 1440, 300
d.ellipse((cx - r - 40, cy - r - 40, cx + r + 40, cy + r + 40), fill=YELLOW)
d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=GREEN)
d.line([(cx - 150, cy + 10), (cx - 40, cy + 120), (cx + 160, cy - 110)], fill=CREAM, width=90, joint="curve")
img.resize((512, 512), Image.LANCZOS).convert("RGB").save(f"{S}/ab/icon_b.png")
print("ok")
