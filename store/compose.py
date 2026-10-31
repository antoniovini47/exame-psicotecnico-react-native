import sys
from PIL import Image, ImageDraw, ImageFont
S, F = sys.argv[1], sys.argv[2]
font = lambda w, s: ImageFont.truetype(f"{F}/{w}/Nunito_{w}.ttf", s)
PETROL, YELLOW, CREAM = "#0E3B43", "#FFC93C", "#FFFBEF"
SHOTS = [
    ("home", 400, "Treine para o psicotécnico", "Atenção, memória e raciocínio num só app"),
    ("atencao", 60, "Atenção concentrada", "Ache todos os símbolos iguais ao alvo"),
    ("dividida", 60, "Atenção dividida", "Número e figura ao mesmo tempo"),
    ("memoria", 60, "Memória visual", "Veja onde acertou e o que faltou"),
    ("questao", 60, "110 questões explicadas", "Toda resposta vem com o porquê"),
]
for i, (name, top, title, sub) in enumerate(SHOTS, 1):
    c = Image.new("RGB", (1080, 1920), PETROL); d = ImageDraw.Draw(c)
    d.text((540, 150), title, font=font("900Black", 76), fill=YELLOW, anchor="mm")
    d.text((540, 245), sub, font=font("700Bold", 42), fill=CREAM, anchor="mm")
    shot = Image.open(f"{S}/raw/{name}.png").convert("RGB").crop((0, top, 1080, 2400))
    w = 860; shot = shot.resize((w, round(shot.height * w / 1080)), Image.LANCZOS)
    mask = Image.new("L", shot.size, 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, *shot.size), 48, fill=255)
    c.paste(shot, ((1080 - w) // 2, 340), mask)
    c.save(f"{S}/out/shot{i}.png")
fg = Image.new("RGB", (1024, 500), PETROL); d = ImageDraw.Draw(fg)
icon = Image.open(f"{S}/out/icon.png").convert("RGBA").resize((300, 300), Image.LANCZOS)
fg.paste(icon, (70, 100), icon)
d.text((420, 175), "Exame Psicotécnico", font=font("900Black", 58), fill=CREAM, anchor="lm")
d.text((420, 255), "Treino para a CNH", font=font("800ExtraBold", 46), fill=YELLOW, anchor="lm")
d.text((420, 330), "Atenção · Memória · Raciocínio", font=font("700Bold", 32), fill="#CFE0E1", anchor="lm")
fg.save(f"{S}/out/feature.png")
