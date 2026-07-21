import os
from pypdf import PdfReader

docs_dir = 'docs'
for filename in sorted(os.listdir(docs_dir)):
    if filename.endswith('.pdf'):
        filepath = os.path.join(docs_dir, filename)
        reader = PdfReader(filepath)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        print(f"--- {filename} ---")
        print(text.strip())
        print("="*40)
