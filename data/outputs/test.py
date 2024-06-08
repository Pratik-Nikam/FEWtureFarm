import os

# Specify the path where you want to create the folders
current_dir = os.path.dirname(os.path.realpath(__file__))
print(current_dir)

# List of folder names
folders = [
    "C1A1E1W1", "C1A1E1W2", "C1A1E2W1", "C1A1E2W2",
    "C1A2E1W1", "C1A2E1W2", "C1A2E2W1", "C1A2E2W2",
    "C2A1E1W1", "C2A1E1W2", "C2A1E2W1", "C2A1E2W2",
    "C2A2E1W1", "C2A2E1W2", "C2A2E2W1", "C2A2E2W2",
    "C3A1E1W1", "C3A1E1W2", "C3A1E2W1", "C3A1E2W2",
    "C3A2E1W1", "C3A2E1W2", "C3A2E2W1", "C3A2E2W2",
    "C4A1E1W1", "C4A1E1W2", "C4A1E2W1", "C4A1E2W2",
    "C4A2E1W1", "C4A2E1W2", "C4A2E2W1", "C4A2E2W2",
    "C5A1E1W1", "C5A1E1W2", "C5A1E2W1", "C5A1E2W2",
    "C5A2E1W1", "C5A2E1W2", "C5A2E2W1", "C5A2E2W2"
]

# Create folders
for folder in folders:
    folder_path = os.path.join(current_dir + "/" + folder)
    os.makedirs(folder_path)
    print(f"Folder '{folder_path}' created.")
