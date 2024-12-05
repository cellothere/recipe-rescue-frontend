🚀 Features
Generate recipes based on ingredients.
View recipe details (ingredients and instructions).
Save and manage your favorite recipes.
Remove saved recipes with a confirmation prompt.

🛠 Prerequisites
Before you begin, ensure you have the following installed on your local machine:

Node.js (LTS recommended)
Yarn or npm
Expo CLI


⚙️ Installation
Follow these steps to set up the project on your local machine:

1. Clone the Repository
bash
Copy code
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
2. Install Dependencies
Using Yarn:

bash
Copy code
yarn install
Or using npm:

bash
Copy code
npm install

▶️ Running the Project
1. Start the Expo Development Server
bash
Copy code
expo start
2. Open the App on Your Device
Expo Go App:
Install the Expo Go app on your iOS or Android device.
Scan the QR code displayed in the terminal or web browser to run the app on your device.
iOS/Android Emulator:
For iOS, use Xcode's iPhone Simulator.
For Android, use an emulator configured in Android Studio.
3. Set API Base URL
Update the API_BASE_URL in your project files to point to your back-end server:

typescript
Copy code
const API_BASE_URL = 'http://<your-server-ip>:5001/api';
Replace <your-server-ip> with your local machine's IP address if testing locally.

🧪 Testing
Add sample users and recipes in your back-end database for testing.
Verify that you can:
Generate a recipe.
Save a recipe.
View saved recipes.
Remove a recipe.

📁 Project Structure
plaintext
Copy code
.
├── assets/                     # Static assets like images
├── components/                 # Reusable components (e.g., RecipeLines)
├── Context/                    # Context providers (e.g., UserContext, AllergyContext)
├── screens/                    # Application screens (e.g., SavedRecipes, RecipeDetails)
├── App.tsx                     # Root component
├── package.json                # Project dependencies and scripts
└── README.md                   # Project documentation
🔧 Common Issues
QR Code Not Scanning
Ensure your device and computer are on the same Wi-Fi network.

Metro Bundler Stuck
Try clearing the cache and restarting:

bash
Copy code
expo start -c
API Not Connecting
Verify your API_BASE_URL is correct.
Ensure your back-end server is running.
