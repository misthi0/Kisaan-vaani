// Voice Recognition and Translation
class KisanVoiceSystem {
    constructor() {
        this.recognition = null;
        this.synthesis = null;
        this.isListening = false;
        this.voiceOutputEnabled = true;
        this.hindiText = '';
        this.englishText = '';
        this.initVoiceRecognition();
        this.initTextToSpeech();
        this.initEventListeners();
        this.loadMarketplaceData();
        this.loadPriceData();
    }

    initVoiceRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.lang = 'hi-IN';
            this.recognition.continuous = true;
            this.recognition.interimResults = true;

            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    this.hindiText = finalTranscript;
                    this.updateHindiDisplay();
                    this.translateToEnglish(finalTranscript);
                    
                    // Immediately speak acknowledgment
                    this.speakHindi(`आपने कहा: ${finalTranscript}. खोज रहे हैं...`);
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopListening();
            };
        } else {
            alert('आवाज़ पहचान इस ब्राउज़र में समर्थित नहीं है। कृपया Chrome का उपयोग करें।');
        }
    }

    initTextToSpeech() {
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
            
            // Set up Hindi voice when available
            this.synthesis.onvoiceschanged = () => {
                const voices = this.synthesis.getVoices();
                this.hindiVoice = voices.find(voice => 
                    voice.lang.includes('hi') || 
                    voice.lang.includes('Hindi') ||
                    voice.name.includes('Hindi')
                ) || voices.find(voice => voice.lang.includes('en-IN')) || voices[0];
            };
        } else {
            console.warn('Text-to-speech not supported in this browser');
        }
    }

    toggleVoiceOutput() {
        this.voiceOutputEnabled = !this.voiceOutputEnabled;
        const btn = document.getElementById('toggleVoiceOutput');
        const icon = btn.querySelector('i');
        const text = btn.querySelector('span');
        
        if (this.voiceOutputEnabled) {
            icon.className = 'fas fa-volume-up';
            text.textContent = 'आवाज़ में जवाब';
            btn.classList.remove('disabled');
            
            // Immediate test with user interaction
            this.testVoiceOutput();
        } else {
            icon.className = 'fas fa-volume-mute';
            text.textContent = 'आवाज़ बंद';
            btn.classList.add('disabled');
            this.synthesis.cancel(); // Stop any current speech
        }
    }

    testVoiceOutput() {
        console.log('Testing voice output...');
        
        // Initialize voices if not already done
        if (!this.hindiVoice) {
            const voices = this.synthesis.getVoices();
            console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
            this.hindiVoice = voices.find(voice => 
                voice.lang.includes('hi') || 
                voice.lang.includes('Hindi') ||
                voice.name.includes('Hindi')
            ) || voices.find(voice => voice.lang.includes('en-IN')) || voices[0];
        }
        
        // Test with a simple Hindi phrase
        this.speakHindi('आवाज़ में जवाब चालू है। किसान वाणी में आपका स्वागत है।');
    }

    speakHindi(text) {
        if (!this.voiceOutputEnabled || !this.synthesis || !text) {
            console.log('Voice output disabled or not available');
            return;
        }
        
        console.log('Attempting to speak:', text);
        
        // Cancel any ongoing speech
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.8; // Slightly slower for clarity
        utterance.pitch = 1;
        utterance.volume = 0.9;
        
        // Use Hindi voice if available
        if (this.hindiVoice) {
            utterance.voice = this.hindiVoice;
            console.log('Using Hindi voice:', this.hindiVoice.name);
        } else {
            console.log('No Hindi voice found, using default');
        }
        
        utterance.onstart = () => console.log('Speech started');
        utterance.onend = () => console.log('Speech ended');
        utterance.onerror = (e) => console.error('Speech error:', e);
        
        try {
            this.synthesis.speak(utterance);
            console.log('Speech synthesis called');
        } catch (error) {
            console.error('Error calling speech synthesis:', error);
        }
    }

    initEventListeners() {
        document.getElementById('startVoice').addEventListener('click', () => this.startListening());
        document.getElementById('stopVoice').addEventListener('click', () => this.stopListening());
        document.getElementById('toggleVoiceOutput').addEventListener('click', () => this.toggleVoiceOutput());
        document.getElementById('testVoice').addEventListener('click', () => this.testVoiceOutput());
        document.getElementById('stateSelect').addEventListener('change', (e) => this.loadStatePrices(e.target.value));
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
            this.isListening = true;
            this.updateVoiceButtons();
            document.getElementById('hindiText').textContent = 'सुन रहे हैं... कृपया बोलें';
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this.updateVoiceButtons();
        }
    }

    updateVoiceButtons() {
        const startBtn = document.getElementById('startVoice');
        const stopBtn = document.getElementById('stopVoice');

        if (this.isListening) {
            startBtn.disabled = true;
            stopBtn.disabled = false;
            startBtn.classList.add('pulse');
        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;
            startBtn.classList.remove('pulse');
        }
    }

    updateHindiDisplay() {
        document.getElementById('hindiText').textContent = this.hindiText;
    }

    // Simple translation mapping for common Hindi crop terms
    translateToEnglish(hindiText) {
        const translations = {
            'धान': 'rice',
            'गेहूं': 'wheat',
            'मक्का': 'corn',
            'चावल': 'rice',
            'सोयाबीन': 'soybean',
            'आलू': 'potato',
            'प्याज': 'onion',
            'टमाटर': 'tomato',
            'गन्ना': 'sugarcane',
            'कपास': 'cotton',
            'जौ': 'barley',
            'बाजरा': 'millet',
            'तिल': 'sesame',
            'सरसों': 'mustard',
            'हल्दी': 'turmeric',
            'लहसुन': 'garlic',
            'अदरक': 'ginger',
            'मिर्च': 'chili',
            'मूंगफली': 'groundnut',
            'चना': 'chickpea'
        };

        let englishTranslation = hindiText.toLowerCase();

        // Replace Hindi words with English equivalents
        Object.keys(translations).forEach(hindi => {
            const regex = new RegExp(hindi, 'g');
            englishTranslation = englishTranslation.replace(regex, translations[hindi]);
        });

        this.englishText = englishTranslation;
        document.getElementById('englishText').textContent = englishTranslation;

        // Search for crops and show results
        this.searchCrops(englishTranslation);
    }

    searchCrops(searchText) {
        const cropData = this.getCropData();
        const stateKeywords = {
            'west bengal': 'west-bengal',
            'bengal': 'west-bengal',
            'kolkata': 'west-bengal',
            'पश्चिम बंगाल': 'west-bengal',
            'telangana': 'telangana',
            'hyderabad': 'telangana',
            'तेलंगाना': 'telangana',
            'हैदराबाद': 'telangana',
            'punjab': 'punjab',
            'amritsar': 'punjab',
            'ludhiana': 'punjab',
            'पंजाब': 'punjab',
            'haryana': 'haryana',
            'karnal': 'haryana',
            'हरियाणा': 'haryana',
            'uttar pradesh': 'uttar-pradesh',
            'up': 'uttar-pradesh',
            'lucknow': 'uttar-pradesh',
            'meerut': 'uttar-pradesh',
            'उत्तर प्रदेश': 'uttar-pradesh',
            'maharashtra': 'maharashtra',
            'महाराष्ट्र': 'maharashtra',
            'madhya pradesh': 'madhya-pradesh',
            'मध्य प्रदेश': 'madhya-pradesh'
        };

        // Enhanced crop keyword mapping with Hindi terms
        const cropKeywords = {
            'धान': ['rice', 'basmati', 'चावल'],
            'चावल': ['rice', 'basmati', 'धान'],
            'गेहूं': ['wheat', 'organic wheat'],
            'प्याज': ['onion', 'onions'],
            'मक्का': ['corn', 'maize', 'sweet corn'],
            'सोयाबीन': ['soybean', 'soybeans', 'soya'],
            'टमाटर': ['tomato', 'tomatoes'],
            'आलू': ['potato', 'potatoes'],
            'कपास': ['cotton'],
            'गन्ना': ['sugarcane', 'sugar'],
            'हल्दी': ['turmeric'],
            'बाजरा': ['millet', 'bajra'],
            'सरसों': ['mustard'],
            'जौ': ['barley']
        };

        // Extract state from voice input
        let detectedState = '';
        for (const [keyword, state] of Object.entries(stateKeywords)) {
            if (searchText.toLowerCase().includes(keyword)) {
                detectedState = state;
                break;
            }
        }

        // Enhanced crop matching with Hindi support
        let searchTerms = [searchText.toLowerCase()];

        // Add related terms if Hindi crop name detected
        for (const [hindiTerm, englishTerms] of Object.entries(cropKeywords)) {
            if (searchText.includes(hindiTerm)) {
                searchTerms = searchTerms.concat(englishTerms);
                break;
            }
        }

        // Filter crops based on search text and related terms
        const matchedCrops = cropData.filter(crop => {
            return searchTerms.some(term => 
                crop.name.toLowerCase().includes(term) || 
                (crop.hindiName && crop.hindiName.includes(term)) ||
                (crop.category && crop.category.toLowerCase().includes(term))
            );
        });

        // If no direct matches, show all crops from detected state
        let finalResults = matchedCrops;
        if (matchedCrops.length === 0 && detectedState) {
            finalResults = cropData.filter(crop => crop.state === detectedState);
        }

        // If still no results, show most relevant crops
        if (finalResults.length === 0) {
            finalResults = cropData.slice(0, 3); // Show first 3 crops as examples
        }

        this.displaySearchResults(finalResults, detectedState, searchText);
    }

    displaySearchResults(crops, detectedState = '', originalSearchText = '') {
        const resultsDiv = document.getElementById('cropResults');
        const searchResults = document.getElementById('searchResults');

        // Get buyers for the detected state or show general buyers
        const buyers = this.getMarketBuyers()[detectedState] || this.getMarketBuyers()['west-bengal'];

        searchResults.classList.add('active');

        if (crops.length > 0) {
            // Prepare Hindi voice summary
            const cropName = crops[0].hindiName || originalSearchText;
            const cropCount = crops.length;
            let voiceSummary = `${originalSearchText} के लिए ${cropCount} परिणाम मिले। `;
            
            if (detectedState) {
                voiceSummary += `आपके राज्य में सीधे खरीददार उपलब्ध हैं। `;
            }
            
            voiceSummary += `बिचौलियों के बिना सीधी बिक्री से आपको अधिक मूल्य मिलेगा।`;
            
            // Speak the summary in Hindi
            setTimeout(() => {
                console.log('About to speak search results:', voiceSummary);
                this.speakHindi(voiceSummary);
            }, 2000); // Wait 2 seconds for UI to load and previous speech to finish
            let searchSummary = `
                <div class="search-summary">
                    <h3>🔍 खोज परिणाम: "${originalSearchText}"</h3>
                    <p>सीधे खरीददार उपलब्ध हैं (बिचौलियों की जरूरत नहीं)</p>
                </div>
            `;

            // Calculate average prices for comparison
            const avgCrop = crops[0]; // Use first crop for demonstration
            const farmerDirectPrice = avgCrop.farmerPrice || 45;
            const middlemanPrice = avgCrop.middlemanPrice || 65;
            const directBuyerPrice = farmerDirectPrice + (farmerDirectPrice * 0.15); // 15% premium for direct buyers

            const middlemanCut = middlemanPrice - farmerDirectPrice;
            const middlemanPercentage = ((middlemanCut / middlemanPrice) * 100).toFixed(0);
            const farmerExtraIncome = directBuyerPrice - farmerDirectPrice;

            resultsDiv.innerHTML = searchSummary + `
                <div class="price-comparison-section">
                    <h3>💰 मूल्य तुलना विश्लेषण</h3>

                    <div class="comparison-grid">
                        <div class="price-box middleman-chain">
                            <h4>बिचौलियों के साथ</h4>
                            <div class="price-breakdown">
                                <p><strong>किसान को मिलता:</strong> ₹${farmerDirectPrice}/kg</p>
                                <p><strong>बिचौलिया जोड़ता:</strong> ₹${middlemanCut}/kg (${middlemanPercentage}%)</p>
                                <p><strong>अंतिम मूल्य:</strong> ₹${middlemanPrice}/kg</p>
                            </div>
                        </div>

                        <div class="price-box direct-buyer">
                            <h4>सीधे खरीददार को</h4>
                            <div class="price-breakdown">
                                <p><strong>किसान को मिलता:</strong> ₹${directBuyerPrice.toFixed(0)}/kg</p>
                                <p><strong>खरीददार देता:</strong> ₹${directBuyerPrice.toFixed(0)}/kg</p>
                                <p><strong>कोई बिचौलिया नहीं!</strong></p>
                            </div>
                        </div>
                    </div>

                    <div class="savings-analysis">
                        <h4>📊 आर्थिक प्रभाव</h4>
                        <div class="impact-grid">
                            <div class="impact-item farmer">
                                <span>किसान की अतिरिक्त आय:</span>
                                <span class="impact-value">+₹${farmerExtraIncome.toFixed(0)}/kg</span>
                            </div>
                            <div class="impact-item buyer">
                                <span>खरीददार की बचत:</span>
                                <span class="impact-value">₹${(middlemanPrice - directBuyerPrice).toFixed(0)}/kg</span>
                            </div>
                            <div class="impact-item total">
                                <span>बिचौलियों का खात्मा:</span>
                                <span class="impact-value">₹${middlemanCut}/kg बचाव</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="buyers-results">
                    <h3>🏢 सत्यापित सीधे खरीददार</h3>
                    <div class="buyers-grid">
                        ${buyers.slice(0, 4).map(buyer => `
                            <div class="buyer-card">
                                <h4>🏢 ${buyer.name}</h4>
                                <p><strong>विशेषज्ञता:</strong> ${buyer.speciality}</p>
                                <p><strong>भुगतान दर:</strong> <span class="buyer-price">${buyer.buyingPrice}</span></p>
                                <div class="buyer-contact">
                                    <a href="tel:${buyer.contact}" class="contact-btn call">
                                        📞 फोन करें ${buyer.contact}
                                    </a>
                                </div>
                                <div class="buyer-benefits">
                                    <small>✅ सीधा भुगतान ✅ न्यायसंगत मूल्य ✅ शून्य कमीशन</small>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="summary-box">
                        <h4>🎯 सीधी बिक्री के मुख्य फायदे</h4>
                        <div class="comparison-stats">
                            <div class="stat">
                                <strong>वर्तमान (बिचौलियों के साथ):</strong> किसान को केवल ${(100 - parseInt(middlemanPercentage))}% अंतिम मूल्य मिलता है
                            </div>
                            <div class="stat positive">
                                <strong>सीधी बिक्री:</strong> किसान को 100% + प्रीमियम बोनस मिलता है
                            </div>
                            <div class="stat highlight">
                                <strong>मासिक अतिरिक्त आय:</strong> ₹${(farmerExtraIncome * 1000).toFixed(0)} प्रति 1000kg बिक्री पर
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Voice output for no results
            const noResultsVoice = `${originalSearchText} के लिए कोई मेल नहीं मिला। कृपया धान, गेहूं, प्याज, मक्का, या टमाटर जैसे शब्दों की खोज करें।`;
            setTimeout(() => {
                console.log('Speaking no results message:', noResultsVoice);
                this.speakHindi(noResultsVoice);
            }, 2000);
            
            searchResults.classList.add('active');
            resultsDiv.innerHTML = `
                <div class="no-results">
                    <h3>🔍 "${originalSearchText}" के लिए कोई मेल नहीं मिला</h3>
                    <p>इन शब्दों की खोज करें: धान, गेहूं, प्याज, मक्का, टमाटर</p>
                    <button onclick="window.kisanSystem.displaySearchResults(window.kisanSystem.getCropData().slice(0,3), '', 'all crops')" class="show-all-btn">
                        उपलब्ध फसलें दिखाएं
                    </button>
                </div>
            `;
        }
    }

    loadMarketplaceData() {
        const cropGrid = document.getElementById('cropGrid');
        const cropData = this.getCropData();

        cropGrid.innerHTML = cropData.map(crop => `
            <div class="crop-card">
                <h3>${crop.name}</h3>
                <p><strong>Farmer:</strong> ${crop.farmer}</p>
                <p><strong>Location:</strong> ${crop.location}</p>
                <p><strong>Quantity:</strong> ${crop.quantity}</p>
                <p><strong>Quality:</strong> ${crop.quality}</p>
                <div class="price-info">
                    <div class="middleman-price">
                        <strong>With Middleman</strong><br>
                        ₹${crop.middlemanPrice}/kg
                    </div>
                    <div class="consumer-price">
                        <strong>Direct Sale</strong><br>
                        ₹${crop.farmerPrice}/kg
                    </div>
                </div>
                <p><strong>Contact:</strong> ${crop.contact}</p>
            </div>
        `).join('');
    }

    getCropData() {
        return [
            {
                name: 'Premium Basmati Rice',
                farmer: 'Ramesh Kumar',
                location: 'Amritsar, Punjab',
                quantity: '500 kg',
                quality: 'Grade A',
                farmerPrice: 45,
                middlemanPrice: 75,
                directBuyerPrice: 52,
                contact: '+91-98765-43210',
                hindiName: 'बासमती चावल',
                state: 'punjab'
            },
            {
                name: 'Organic Wheat',
                farmer: 'Suresh Patel',
                location: 'Indore, Madhya Pradesh',
                quantity: '2000 kg',
                quality: 'Organic Certified',
                farmerPrice: 28,
                middlemanPrice: 45,
                directBuyerPrice: 32,
                contact: '+91-98765-43211',
                hindiName: 'गेहूं',
                state: 'madhya-pradesh'
            },
            {
                name: 'Fresh Onions',
                farmer: 'Mahesh Singh',
                location: 'Nashik, Maharashtra',
                quantity: '1000 kg',
                quality: 'Premium',
                farmerPrice: 18,
                middlemanPrice: 35,
                directBuyerPrice: 22,
                contact: '+91-98765-43212',
                hindiName: 'प्याज',
                state: 'maharashtra'
            },
            {
                name: 'Sweet Corn',
                farmer: 'Rajesh Verma',
                location: 'Shimla, Himachal Pradesh',
                quantity: '300 kg',
                quality: 'Fresh Harvest',
                farmerPrice: 32,
                middlemanPrice: 55,
                directBuyerPrice: 38,
                contact: '+91-98765-43213',
                hindiName: 'मक्का',
                state: 'himachal-pradesh'
            },
            {
                name: 'Premium Soybeans',
                farmer: 'Dinesh Gupta',
                location: 'Bhopal, Madhya Pradesh',
                quantity: '1500 kg',
                quality: 'Grade A',
                farmerPrice: 42,
                middlemanPrice: 65,
                directBuyerPrice: 48,
                contact: '+91-98765-43214',
                hindiName: 'सोयाबीन',
                state: 'madhya-pradesh'
            },
            {
                name: 'Fresh Tomatoes',
                farmer: 'Anil Sharma',
                location: 'Pune, Maharashtra',
                quantity: '800 kg',
                quality: 'Farm Fresh',
                farmerPrice: 25,
                middlemanPrice: 42,
                directBuyerPrice: 29,
                contact: '+91-98765-43215',
                hindiName: 'टमाटर',
                state: 'maharashtra'
            }
        ];
    }

    // Market Buyer Database - Complete Database from Attached File
    getMarketBuyers() {
        return {
            'west-bengal': [
                { name: 'Tea Board of India', contact: '033-2235-1331', speciality: 'Tea & Agricultural Products', buyingPrice: 'MSP + 25%' },
                { name: 'West Bengal State Agricultural Marketing Board', contact: '033-2287-0194', speciality: 'All Agricultural Products', buyingPrice: 'Market Rate + 15%' },
                { name: 'Bidhan Chandra Krishi Viswavidyalaya (BCKV)', contact: '033-2587-8163', speciality: 'Research & Quality Crops', buyingPrice: 'Premium + 20%' },
                { name: 'West Bengal Agro Industries Corporation', contact: '033-2225-7561', speciality: 'Industrial Processing', buyingPrice: 'Bulk Rate + 18%' }
            ],
            'telangana': [
                { name: 'Telangana State Seed & Organic Certification Authority', contact: '040-2323-7016', speciality: 'Organic & Certified Seeds', buyingPrice: 'Organic Premium + 30%' },
                { name: 'Department of Agriculture, Govt. of Telangana', contact: '040-2323-2107', speciality: 'All Agricultural Products', buyingPrice: 'Govt Rate + 15%' },
                { name: 'Professor Jayashankar Telangana State Agricultural University', contact: '040-2401-5011', speciality: 'Research Quality Crops', buyingPrice: 'Research Premium + 25%' },
                { name: 'TS-MARKFED', contact: '991-203-8666', speciality: 'Marketing & Distribution', buyingPrice: 'Direct Marketing + 20%' }
            ],
            'punjab': [
                { name: 'Punjab Agro Industries', contact: '+91-98876-54321', speciality: 'Wheat & Rice', buyingPrice: 'MSP + 10%' },
                { name: 'Ludhiana Food Corp', contact: '+91-97654-32198', speciality: 'Basmati Rice', buyingPrice: 'Export Premium + 30%' },
                { name: 'Bathinda Cotton Co.', contact: '+91-96543-21087', speciality: 'Cotton & Sugarcane', buyingPrice: 'Bulk Purchase + 15%' },
                { name: 'Amritsar Grain Exchange', contact: '+91-95432-16789', speciality: 'Premium Grains', buyingPrice: 'Quality Bonus + 22%' }
            ],
            'haryana': [
                { name: 'Karnal Grain Exchange', contact: '+91-99876-54321', speciality: 'Wheat & Mustard', buyingPrice: 'Market Premium + 12%' },
                { name: 'Hisar Agro Processors', contact: '+91-98765-43210', speciality: 'Barley & Bajra', buyingPrice: 'Direct Sale + 18%' },
                { name: 'Kurukshetra Rice Mills', contact: '+91-97531-24680', speciality: 'Rice Processing', buyingPrice: 'Quality Bonus + 20%' },
                { name: 'Rohtak Food Corporation', contact: '+91-94567-89123', speciality: 'Food Processing', buyingPrice: 'Processing Premium + 16%' }
            ],
            'uttar-pradesh': [
                { name: 'KVK Sitapur', contact: '+91-90050-92466', speciality: 'Research & Quality Seeds', buyingPrice: 'Premium Quality + 20%' },
                { name: 'KVK Kaushambi', contact: '+91-94509-65185', speciality: 'Agricultural Extension', buyingPrice: 'Direct Purchase + 18%' },
                { name: 'KVK Fatehpur', contact: '+91-84483-16668', speciality: 'Crop Development', buyingPrice: 'Development Rate + 15%' },
                { name: 'Meerut Agro Industries', contact: '+91-98123-45678', speciality: 'Sugar & Grains', buyingPrice: 'Industrial Rate + 22%' }
            ],
            'maharashtra': [
                { name: 'Nashik Onion Traders', contact: '+91-99123-45678', speciality: 'Onions & Vegetables', buyingPrice: 'Export Quality + 20%' },
                { name: 'Pune Food Processing', contact: '+91-98654-78912', speciality: 'Vegetables & Fruits', buyingPrice: 'Fresh Produce + 18%' },
                { name: 'Mumbai Agro Export', contact: '+91-97531-86420', speciality: 'Export Quality Crops', buyingPrice: 'International Rate + 30%' },
                { name: 'Kolhapur Sugar Mills', contact: '+91-96789-12345', speciality: 'Sugarcane Processing', buyingPrice: 'Mill Rate + 15%' }
            ],
            'madhya-pradesh': [
                { name: 'Bhopal Agro Processing', contact: '+91-98765-43219', speciality: 'Soybean & Wheat', buyingPrice: 'Processing Premium + 18%' },
                { name: 'Indore Food Corporation', contact: '+91-97654-32187', speciality: 'All Food Grains', buyingPrice: 'Market Rate + 16%' },
                { name: 'Jabalpur Grain Market', contact: '+91-96543-21076', speciality: 'Regional Grains', buyingPrice: 'Regional Premium + 14%' },
                { name: 'Gwalior Agricultural Trading', contact: '+91-95432-10965', speciality: 'Agricultural Trading', buyingPrice: 'Trading Premium + 12%' }
            ]
        };
    }

    loadPriceData() {
        const priceData = {
            'west-bengal': [
                { crop: 'Rice', price: '₹30-35/kg', market: 'Kolkata Mandi' },
                { crop: 'Potato', price: '₹15-20/kg', market: 'Hooghly Market' },
                { crop: 'Jute', price: '₹4500-5000/quintal', market: 'Barrackpore' },
                { crop: 'Tea', price: '₹200-250/kg', market: 'Darjeeling' }
            ],
            'telangana': [
                { crop: 'Rice', price: '₹25-30/kg', market: 'Hyderabad Mandi' },
                { crop: 'Cotton', price: '₹5500-6000/quintal', market: 'Warangal' },
                { crop: 'Maize', price: '₹18-22/kg', market: 'Karimnagar' },
                { crop: 'Turmeric', price: '₹80-100/kg', market: 'Nizamabad' }
            ],
            'arunachal-pradesh': [
                { crop: 'Rice', price: '₹35-40/kg', market: 'Itanagar' },
                { crop: 'Ginger', price: '₹60-80/kg', market: 'Tawang' },
                { crop: 'Cardamom', price: '₹1200-1500/kg', market: 'Bomdila' },
                { crop: 'Orange', price: '₹40-50/kg', market: 'Pasighat' }
            ],
            'punjab': [
                { crop: 'Wheat', price: '₹22-25/kg', market: 'Ludhiana Mandi' },
                { crop: 'Rice', price: '₹28-32/kg', market: 'Amritsar' },
                { crop: 'Cotton', price: '₹5800-6200/quintal', market: 'Bathinda' },
                { crop: 'Sugarcane', price: '₹300-350/quintal', market: 'Jalandhar' }
            ],
            'haryana': [
                { crop: 'Wheat', price: '₹20-24/kg', market: 'Karnal Mandi' },
                { crop: 'Rice', price: '₹26-30/kg', market: 'Kurukshetra' },
                { crop: 'Mustard', price: '₹45-50/kg', market: 'Hisar' },
                { crop: 'Bajra', price: '₹18-22/kg', market: 'Rohtak' }
            ],
            'uttar-pradesh': [
                { crop: 'Wheat', price: '₹21-25/kg', market: 'Meerut Mandi' },
                { crop: 'Sugarcane', price: '₹280-320/quintal', market: 'Lucknow' },
                { crop: 'Potato', price: '₹12-18/kg', market: 'Agra' },
                { crop: 'Rice', price: '₹24-28/kg', market: 'Varanasi' }
            ]
        };

        this.priceData = priceData;
    }

    loadStatePrices(state) {
        const priceGrid = document.getElementById('priceGrid');

        if (state && this.priceData[state]) {
            priceGrid.innerHTML = this.priceData[state].map(item => `
                <div class="price-card fade-in">
                    <h4>${item.crop}</h4>
                    <div class="price">${item.price}</div>
                    <p><strong>Market:</strong> ${item.market}</p>
                </div>
            `).join('');
        } else {
            priceGrid.innerHTML = '<p style="text-align: center; color: #666;">Please select a state to view prices</p>';
        }
    }
}

// Utility Functions
function scrollToVoiceSearch() {
    document.getElementById('voice-search').scrollIntoView({ behavior: 'smooth' });
}

// Initialize the system when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.kisanSystem = new KisanVoiceSystem();

    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});