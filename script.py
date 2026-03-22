from docx import Document
from pathlib import Path
paths = [Path(r'C:/Users/User/Desktop/START UP/S3 training/S3 Aplikim Ilda e korrigjuar.docx'),
         Path(r'C:/Users/User/Desktop/START UP/S3 training/S3 it kerkese.docx'),
         Path(r'C:/Users/User/Desktop/START UP/S3 training/Shenime aplikimi.docx')]
for path in paths:
    print('@@', path.name)
    doc = Document(path)
    for para in doc.paragraphs[:20]:
        text = para.text.strip()
        if text:
            print(text)
    print('---\n')
