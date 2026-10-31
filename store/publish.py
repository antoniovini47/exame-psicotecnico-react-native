import sys, requests, warnings
warnings.filterwarnings("ignore")
from google.oauth2 import service_account
from google.auth.transport.requests import Request

key, pkg, aab, out = sys.argv[1:5]
LANG = "pt-BR"
TITLE = "Exame Psicotécnico: Treino CNH"
SHORT = "Treine atenção, memória e raciocínio para o psicotécnico da CNH."
FULL = """Treine para a avaliação psicológica da CNH, o famoso psicotécnico, com exercícios de atenção, memória e raciocínio. Toda resposta vem com a explicação do porquê.

O QUE TEM NO APP
• Atenção concentrada: ache todos os símbolos iguais ao alvo antes de o tempo acabar.
• Atenção dividida: acompanhe um número e uma figura ao mesmo tempo e reaja aos dois.
• Memória visual: memorize figuras e encontre-as no meio de outras.
• Raciocínio lógico: 110 questões de sequências, analogias, lógica e cálculo, todas com explicação.
• Simulado: as 4 habilidades em sequência, com o resultado de cada etapa e a revisão dos erros.
• Progresso: seus últimos resultados por habilidade e os dias seguidos de treino.

COMO FUNCIONA
Escolha uma habilidade ou faça o simulado completo. No raciocínio lógico, ao responder você vê na hora se acertou e por quê. Nos treinos de atenção e memória, marcar o que não devia conta como erro, então vale mais a precisão do que a pressa.

Treino rápido, sem cadastro e funciona sem internet. O app é gratuito e mostra anúncios; se preferir, assista a um vídeo curto e fique 24 horas sem anúncios de tela cheia.

AVISO
Este app é um material de treino independente. Não tem vínculo com o Detran, o Contran ou o Conselho Federal de Psicologia e não reproduz testes psicológicos oficiais, que são de uso exclusivo de psicólogos. O resultado do app não substitui nem prevê o resultado da avaliação feita pelo psicólogo do trânsito."""
NOTES = """Nova versão, toda refeita:
► Treinos de atenção concentrada, atenção dividida e memória visual
► 110 questões de raciocínio, todas com explicação
► Simulado com as 4 habilidades e revisão dos erros
► Visual novo, modo escuro e acompanhamento do progresso"""

c = service_account.Credentials.from_service_account_file(key, scopes=["https://www.googleapis.com/auth/androidpublisher"])
c.refresh(Request())
H = {"Authorization": f"Bearer {c.token}"}
B = f"https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{pkg}"
U = f"https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/{pkg}"
eid = requests.post(f"{B}/edits", headers=H).json()["id"]

def check(r, step):
    if not r.ok:
        print(step, r.status_code, r.text[:600]); requests.delete(f"{B}/edits/{eid}", headers=H); sys.exit(1)
    return r.json() if r.text else {}

with open(aab, "rb") as f:
    vc = check(requests.post(f"{U}/edits/{eid}/bundles?uploadType=media", headers={**H, "Content-Type": "application/octet-stream"}, data=f, timeout=900), "BUNDLE")["versionCode"]
check(requests.put(f"{B}/edits/{eid}/tracks/production", headers=H, json={"track": "production", "releases": [
    {"name": "3.0.0", "versionCodes": [str(vc)], "status": "completed", "releaseNotes": [{"language": LANG, "text": NOTES}]}]}), "TRACK")
check(requests.put(f"{B}/edits/{eid}/listings/{LANG}", headers=H, json={"language": LANG, "title": TITLE, "shortDescription": SHORT, "fullDescription": FULL}), "LISTING")
for kind, files in [("icon", ["icon.png"]), ("featureGraphic", ["feature.png"]), ("phoneScreenshots", [f"shot{i}.png" for i in range(1, 6)])]:
    check(requests.delete(f"{B}/edits/{eid}/listings/{LANG}/{kind}", headers=H), f"DELETE {kind}")
    for name in files:
        with open(f"{out}/{name}", "rb") as f:
            check(requests.post(f"{U}/edits/{eid}/listings/{LANG}/{kind}?uploadType=media", headers={**H, "Content-Type": "image/png"}, data=f), f"IMAGE {name}")
check(requests.post(f"{B}/edits/{eid}:commit", headers=H), "COMMIT")
print("COMMITTED", vc)
