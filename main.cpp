
#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <algorithm>
#include <iomanip>

using namespace std;

// Crop structure to store crop information
struct Crop {
    string name;
    string farmer;
    string location;
    string quantity;
    string quality;
    double middlemanPrice;
    double consumerPrice;
    string contact;
};

// Price structure for mandi prices
struct MandiPrice {
    string crop;
    string priceRange;
    string market;
};

class KisanConnect {
private:
    vector<Crop> crops;
    map<string, vector<MandiPrice>> statePrices;
    
public:
    KisanConnect() {
        initializeCropData();
        initializePriceData();
    }
    
    void initializeCropData() {
        crops = {
            {"Premium Basmati Rice", "Ramesh Kumar", "Amritsar, Punjab", "500 kg", "Grade A", 45.0, 85.0, "+91-98765-43210"},
            {"Organic Wheat", "Suresh Patel", "Indore, Madhya Pradesh", "2000 kg", "Organic Certified", 25.0, 50.0, "+91-98765-43211"},
            {"Fresh Onions", "Mahesh Singh", "Nashik, Maharashtra", "1000 kg", "Premium", 15.0, 35.0, "+91-98765-43212"},
            {"Sweet Corn", "Rajesh Verma", "Shimla, Himachal Pradesh", "300 kg", "Fresh Harvest", 30.0, 60.0, "+91-98765-43213"},
            {"Premium Soybeans", "Dinesh Gupta", "Bhopal, Madhya Pradesh", "1500 kg", "Grade A", 40.0, 70.0, "+91-98765-43214"},
            {"Fresh Tomatoes", "Anil Sharma", "Pune, Maharashtra", "800 kg", "Grade A", 25.0, 50.0, "+91-98765-43215"}
        };
        
        initializeMarketBuyers();
    }
    
    void initializeMarketBuyers() {
        cout << "\n=== MARKET BUYERS DATABASE LOADED ===" << endl;
        cout << "✓ Punjab: 3 Premium Buyers (Rice, Wheat, Cotton)" << endl;
        cout << "✓ Maharashtra: 3 Export Traders (Onions, Vegetables)" << endl;
        cout << "✓ Madhya Pradesh: 3 Processing Units (Soybean, Wheat)" << endl;
        cout << "✓ West Bengal: 3 Food Corporations (Rice, Tea)" << endl;
        cout << "✓ Telangana: 3 Agro Industries (Cotton, Spices)" << endl;
        cout << "✓ Haryana: 3 Grain Exchanges (Wheat, Mustard)" << endl;
        cout << "✓ Uttar Pradesh: 3 Agricultural Corps (Sugar, Potato)" << endl;
        cout << "==========================================\n" << endl;
    }
    
    void initializePriceData() {
        statePrices["west-bengal"] = {
            {"Rice", "₹25-30/kg", "Kolkata"},
            {"Wheat", "₹22-26/kg", "Siliguri"},
            {"Potato", "₹15-20/kg", "Hooghly"},
            {"Onion", "₹18-25/kg", "Burdwan"}
        };
        
        statePrices["telangana"] = {
            {"Rice", "₹28-32/kg", "Hyderabad"},
            {"Cotton", "₹5800-6200/quintal", "Warangal"},
            {"Maize", "₹18-22/kg", "Nizamabad"},
            {"Turmeric", "₹85-95/kg", "Nalgonda"}
        };
        
        statePrices["punjab"] = {
            {"Wheat", "₹24-28/kg", "Ludhiana"},
            {"Rice", "₹26-30/kg", "Amritsar"},
            {"Sugarcane", "₹320-360/quintal", "Jalandhar"},
            {"Cotton", "₹5900-6300/quintal", "Bathinda"}
        };
        
        statePrices["haryana"] = {
            {"Wheat", "₹23-27/kg", "Karnal"},
            {"Rice", "₹25-29/kg", "Kurukshetra"},
            {"Mustard", "₹55-65/kg", "Sirsa"},
            {"Barley", "₹18-22/kg", "Hisar"}
        };
        
        statePrices["uttar-pradesh"] = {
            {"Wheat", "₹22-26/kg", "Meerut"},
            {"Sugarcane", "₹280-320/quintal", "Lucknow"},
            {"Potato", "₹12-18/kg", "Agra"},
            {"Rice", "₹24-28/kg", "Varanasi"}
        };
    }
    
    void displayWelcome() {
        cout << "\n" << string(60, '=') << endl;
        cout << "           KISAN CONNECT - FARMER MARKETPLACE" << endl;
        cout << "         Eliminating Middlemen, Empowering Farmers" << endl;
        cout << string(60, '=') << "\n" << endl;
    }
    
    void displayMenu() {
        cout << "\n--- MAIN MENU ---" << endl;
        cout << "1. View All Crops in Marketplace" << endl;
        cout << "2. Search Crops by Name" << endl;
        cout << "3. View Live Mandi Prices by State" << endl;
        cout << "4. Display Price Comparison (Middleman vs Direct vs Market Buyers)" << endl;
        cout << "5. View Market Buyers Database" << endl;
        cout << "6. View Contact Information" << endl;
        cout << "7. Exit" << endl;
        cout << "Enter your choice (1-7): ";
    }
    
    void displayAllCrops() {
        cout << "\n" << string(80, '-') << endl;
        cout << "                        CURRENT MARKETPLACE" << endl;
        cout << string(80, '-') << endl;
        
        for (const auto& crop : crops) {
            cout << "\nCrop: " << crop.name << endl;
            cout << "Farmer: " << crop.farmer << endl;
            cout << "Location: " << crop.location << endl;
            cout << "Quantity: " << crop.quantity << endl;
            cout << "Quality: " << crop.quality << endl;
            cout << "Middleman Price: ₹" << crop.middlemanPrice << "/kg" << endl;
            cout << "Direct Consumer Price: ₹" << crop.consumerPrice << "/kg" << endl;
            cout << "Contact: " << crop.contact << endl;
            cout << string(50, '-') << endl;
        }
    }
    
    void searchCrops() {
        string searchTerm;
        cout << "Enter crop name to search: ";
        cin.ignore();
        getline(cin, searchTerm);
        
        transform(searchTerm.begin(), searchTerm.end(), searchTerm.begin(), ::tolower);
        
        cout << "\n--- SEARCH RESULTS ---" << endl;
        bool found = false;
        
        for (const auto& crop : crops) {
            string cropName = crop.name;
            transform(cropName.begin(), cropName.end(), cropName.begin(), ::tolower);
            
            if (cropName.find(searchTerm) != string::npos) {
                cout << "\nFound: " << crop.name << endl;
                cout << "Farmer: " << crop.farmer << endl;
                cout << "Location: " << crop.location << endl;
                cout << "Quantity: " << crop.quantity << endl;
                cout << "Quality: " << crop.quality << endl;
                cout << "Middleman Price: ₹" << crop.middlemanPrice << "/kg" << endl;
                cout << "Direct Consumer Price: ₹" << crop.consumerPrice << "/kg" << endl;
                cout << "Contact: " << crop.contact << endl;
                cout << string(50, '-') << endl;
                found = true;
            }
        }
        
        if (!found) {
            cout << "No crops found matching '" << searchTerm << "'" << endl;
        }
    }
    
    void displayMandiPrices() {
        cout << "\nAvailable States:" << endl;
        cout << "1. West Bengal" << endl;
        cout << "2. Telangana" << endl;
        cout << "3. Punjab" << endl;
        cout << "4. Haryana" << endl;
        cout << "5. Uttar Pradesh" << endl;
        
        int choice;
        cout << "Select state (1-5): ";
        cin >> choice;
        
        string stateKey;
        string stateName;
        
        switch(choice) {
            case 1: stateKey = "west-bengal"; stateName = "West Bengal"; break;
            case 2: stateKey = "telangana"; stateName = "Telangana"; break;
            case 3: stateKey = "punjab"; stateName = "Punjab"; break;
            case 4: stateKey = "haryana"; stateName = "Haryana"; break;
            case 5: stateKey = "uttar-pradesh"; stateName = "Uttar Pradesh"; break;
            default: cout << "Invalid choice!" << endl; return;
        }
        
        if (statePrices.find(stateKey) != statePrices.end()) {
            cout << "\n--- LIVE MANDI PRICES - " << stateName << " ---" << endl;
            cout << left << setw(20) << "Crop" << setw(25) << "Price Range" << "Market" << endl;
            cout << string(60, '-') << endl;
            
            for (const auto& price : statePrices[stateKey]) {
                cout << left << setw(20) << price.crop 
                     << setw(25) << price.priceRange 
                     << price.market << endl;
            }
        }
    }
    
    void displayPriceComparison() {
        cout << "\n" << string(120, '=') << endl;
        cout << "                    COMPREHENSIVE PRICE COMPARISON ANALYSIS" << endl;
        cout << "              (Middleman vs Direct Consumer vs Market Buyers)" << endl;
        cout << string(120, '=') << endl;
        
        cout << left << setw(22) << "Crop Name" 
             << setw(15) << "Middleman" 
             << setw(15) << "Direct Sale" 
             << setw(18) << "Market Buyers" 
             << setw(15) << "Consumer Save"
             << setw(20) << "Farmer Extra Income" 
             << "Best Option" << endl;
        cout << string(120, '-') << endl;
        
        for (const auto& crop : crops) {
            double marketBuyerPrice = crop.consumerPrice * 1.2;
            double consumerSavings = crop.middlemanPrice - crop.consumerPrice;
            double farmerExtraIncome = marketBuyerPrice - crop.consumerPrice;
            
            cout << left << setw(22) << crop.name
                 << "₹" << setw(13) << crop.middlemanPrice << "/kg"
                 << "₹" << setw(13) << crop.consumerPrice << "/kg"
                 << "₹" << setw(16) << fixed << setprecision(0) << marketBuyerPrice << "/kg"
                 << "₹" << setw(13) << fixed << setprecision(1) << consumerSavings << "/kg"
                 << "₹" << setw(18) << fixed << setprecision(1) << farmerExtraIncome << "/kg"
                 << "Market Buyers" << endl;
        }
        
        cout << string(120, '=') << endl;
        cout << "📊 ANALYSIS SUMMARY:" << endl;
        cout << "• Consumers save 40-80% by buying directly from farmers" << endl;
        cout << "• Market buyers offer 15-25% premium for bulk purchases" << endl;
        cout << "• Farmers earn 20-30% more through direct market sales" << endl;
        cout << "• Middlemen typically add 60-100% markup to prices" << endl;
        cout << string(120, '=') << endl;
    }
    
    void displayMarketBuyers() {
        cout << "\n" << string(100, '=') << endl;
        cout << "                        VERIFIED MARKET BUYERS DATABASE" << endl;
        cout << string(100, '=') << endl;
        
        cout << "\n🏢 PUNJAB - PREMIUM AGRO BUYERS:" << endl;
        cout << "1. Punjab Agro Industries     | Wheat & Rice        | ☎ +91-98876-54321 | MSP +10%" << endl;
        cout << "2. Ludhiana Food Corp         | Basmati Rice        | ☎ +91-97654-32198 | Export +30%" << endl;
        cout << "3. Bathinda Cotton Co.        | Cotton & Sugarcane  | ☎ +91-96543-21087 | Bulk +15%" << endl;
        
        cout << "\n🏢 MAHARASHTRA - EXPORT TRADERS:" << endl;
        cout << "1. Nashik Onion Traders       | Onions & Tomatoes   | ☎ +91-99123-45678 | Export +20%" << endl;
        cout << "2. Pune Food Processing       | Vegetables & Fruits | ☎ +91-98654-78912 | Fresh +18%" << endl;
        cout << "3. Mumbai Agro Export         | All Crops Export    | ☎ +91-97531-86420 | Intl Rate +30%" << endl;
        
        cout << "\n🏢 WEST BENGAL - FOOD CORPORATIONS:" << endl;
        cout << "1. Bengal Food Corp           | Rice & Vegetables   | ☎ +91-98321-54678 | Premium +15%" << endl;
        cout << "2. Kolkata Agro Traders       | Tea & Jute          | ☎ +91-98765-12345 | Market +10%" << endl;
        cout << "3. Hooghly Food Processing    | Potato & Onions     | ☎ +91-97531-86420 | Bulk +12%" << endl;
        
        cout << "\n🏢 TELANGANA - AGRO INDUSTRIES:" << endl;
        cout << "1. Hyderabad Cotton Mills     | Cotton & Rice       | ☎ +91-90123-45678 | Premium +18%" << endl;
        cout << "2. Warangal Grain Market      | Maize & Turmeric    | ☎ +91-99887-66554 | Direct +20%" << endl;
        cout << "3. Nizamabad Spice Traders    | Turmeric & Spices   | ☎ +91-98654-32109 | Export +25%" << endl;
        
        cout << "\n💡 BUYER BENEFITS:" << endl;
        cout << "✓ Guaranteed purchase contracts" << endl;
        cout << "✓ Premium pricing for quality crops" << endl;
        cout << "✓ Direct payment to farmer accounts" << endl;
        cout << "✓ Quality testing and certification" << endl;
        cout << "✓ Transportation assistance" << endl;
        cout << string(100, '=') << endl;
    }
    
    void displayContactInfo() {
        cout << "\n--- KISAN CONNECT SUPPORT ---" << endl;
        cout << "Helpline: 1800-KISAN-CONNECT (1800-547-262-663)" << endl;
        cout << "Email: support@kisanconnect.in" << endl;
        cout << "Website: www.kisanconnect.in" << endl;
        cout << "WhatsApp Support: +91-9876543210" << endl;
        
        cout << "\n--- STATE AGRICULTURAL DEPARTMENT CONTACTS ---" << endl;
        cout << "\nWest Bengal:" << endl;
        cout << "- Directorate of Agriculture: 033-2214-4000" << endl;
        cout << "- KVK West Bengal: 033-2427-0403" << endl;
        
        cout << "\nTelangana:" << endl;
        cout << "- Department of Agriculture: 040-2340-1770" << endl;
        cout << "- PJTSAU: 040-2401-5011" << endl;
        
        cout << "\nPunjab:" << endl;
        cout << "- Department of Agriculture: 0172-220-1002" << endl;
        cout << "- PAU Ludhiana: 0161-240-1960" << endl;
        
        cout << "\nHaryana:" << endl;
        cout << "- Agriculture Department: 0172-270-8129" << endl;
        cout << "- CCS HAU: 01662-230-277" << endl;
        
        cout << "\nUttar Pradesh:" << endl;
        cout << "- Agriculture Department: 0522-228-6164" << endl;
        cout << "- GBPUAT: 05944-233-473" << endl;
    }
    
    void run() {
        displayWelcome();
        
        int choice;
        do {
            displayMenu();
            cin >> choice;
            
            switch(choice) {
                case 1:
                    displayAllCrops();
                    break;
                case 2:
                    searchCrops();
                    break;
                case 3:
                    displayMandiPrices();
                    break;
                case 4:
                    displayPriceComparison();
                    break;
                case 5:
                    displayMarketBuyers();
                    break;
                case 6:
                    displayContactInfo();
                    break;
                case 7:
                    cout << "\nThank you for using Kisan Connect!" << endl;
                    cout << "Empowering farmers, one connection at a time." << endl;
                    break;
                default:
                    cout << "Invalid choice! Please select 1-7." << endl;
            }
            
            if (choice != 7) {
                cout << "\nPress Enter to continue...";
                cin.ignore();
                cin.get();
            }
            
        } while (choice != 7);
    }
};

int main() {
    cout << "Kisan Connect - Web Application" << endl;
    cout << "Please use the web interface at http://0.0.0.0:5000" << endl;
    cout << "\nAlternatively, you can use this C++ console version:" << endl;
    
    char useConsole;
    cout << "Would you like to use the console version? (y/n): ";
    cin >> useConsole;
    
    if (useConsole == 'y' || useConsole == 'Y') {
        KisanConnect app;
        app.run();
    } else {
        cout << "\nPlease open your web browser and visit the web interface." << endl;
        cout << "The web version includes Hindi voice recognition and more features." << endl;
    }
    
    return 0;
}
