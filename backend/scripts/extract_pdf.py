import os
import glob
import re
import json
import fitz  # PyMuPDF

def extract_pdf_chapters():
    input_dir = r"C:\Users\Lenovo Gaming\Downloads\test-manhow\a-mans-man"
    output_base_dir = r"c:\Users\Lenovo Gaming\Desktop\projects\manhaw-managa\backend\public\uploads\a-mans-man"
    
    os.makedirs(output_base_dir, exist_ok=True)
    
    # Find all PDF files in the input directory
    pdf_files = glob.glob(os.path.join(input_dir, "*.pdf"))
    print(f"Found {len(pdf_files)} PDF files in {input_dir}")
    
    chapters_data = []
    
    # Sort files naturally or by number
    def get_episode_num(filename):
        # Match "(1) Episode 1.pdf" or similar
        match = re.search(r'\((\d+)\)', os.path.basename(filename))
        if match:
            return int(match.group(1))
        match2 = re.search(r'Episode\s+(\d+)', os.path.basename(filename), re.IGNORECASE)
        if match2:
            return int(match2.group(1))
        # fallback
        return 999

    pdf_files.sort(key=get_episode_num)
    
    for pdf_path in pdf_files:
        filename = os.path.basename(pdf_path)
        chapter_num = get_episode_num(pdf_path)
        
        print(f"Processing: {filename} -> Chapter {chapter_num}")
        
        try:
            doc = fitz.open(pdf_path)
            pages_list = []
            
            for page_idx in range(len(doc)):
                page = doc[page_idx]
                # Render page to image (150 DPI is a good balance between speed/quality)
                pix = page.get_pixmap(dpi=150)
                
                # Output filename
                image_name = f"ch_{chapter_num}_page_{page_idx + 1}.jpg"
                image_path = os.path.join(output_base_dir, image_name)
                
                # Save as JPG
                pix.save(image_path, "jpg")
                
                # Web relative path
                web_url = f"/uploads/a-mans-man/{image_name}"
                pages_list.append({
                    "pageNumber": page_idx + 1,
                    "imageUrl": web_url
                })
                
            chapters_data.append({
                "chapterNumber": chapter_num,
                "title": f"الفصل {chapter_num}: حلقة {chapter_num}",
                "pages": pages_list,
                "views": 0,
                "createdAt": "2026-06-18T12:00:00.000Z"
            })
            print(f"Successfully extracted Chapter {chapter_num} with {len(pages_list)} pages.")
            
        except Exception as e:
            print(f"Error extracting {filename}: {str(e)}")
            
    # Write JSON output
    output_json_path = os.path.join(os.path.dirname(output_base_dir), "a-mans-man-metadata.json")
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(chapters_data, f, ensure_ascii=False, indent=4)
        
    print(f"\nMetadata saved successfully to {output_json_path}")

if __name__ == "__main__":
    extract_pdf_chapters()
