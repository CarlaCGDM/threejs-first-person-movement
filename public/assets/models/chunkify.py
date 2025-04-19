import os

CHUNK_SIZE = 20 * 1024 * 1024  # 20MB chunks (safe under 25MB limit)

def chunkify(model_path):
    folder = f"{os.path.splitext(model_path)[0]}_Chunks"
    os.makedirs(folder, exist_ok=True)
    
    with open(model_path, 'rb') as f:
        chunk_num = 1
        while True:
            chunk_data = f.read(CHUNK_SIZE)
            if not chunk_data:
                break
            with open(f"{folder}/Chunk_{chunk_num:03d}.bin", 'wb') as chunk_file:
                chunk_file.write(chunk_data)
            chunk_num += 1

# Usage:
chunkify("CovaBonica_LODs/LOD_03.glb")
chunkify("CovaBonica_LODs/LOD_04.glb")