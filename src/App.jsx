import React, { useState, useCallback, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoadingScreen from './components/LoadingScreen';
import ResponseGrid from './components/ResponseGrid';
import EndScreen from './components/EndScreen';
import ChatPopup from './components/ChatPopup';
import CharacterSelectPage from './components/CharacterSelectPage';
import { chars } from './data/characters'; // Import characters
import { getCharacterResponse } from './api/gemini'; // Import API function

// Add delay function to the App component
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing'); // landing, loading, response, end, character-select
  const [userQuestion, setUserQuestion] = useState(''); // Store the initial question
  const [currentConversation, setCurrentConversation] = useState([]); // Stores sequence of user questions [{ role: 'user', parts: [{text: '...'}] }]
  const [chatHistory, setChatHistory] = useState({}); // { characterId: [{ role: 'user'/'model', parts: [{text: '...'}] }] }
  const [responses, setResponses] = useState([]); // [{ characterId, name, avatar, responseText }]
  const [selectedCharacter, setSelectedCharacter] = useState(null); // Character object for popup
  const [isLoading, setIsLoading] = useState(false); // Explicit loading state
  
  // Character selection state
  const [selectedCharacters, setSelectedCharacters] = useState(() => {
    // Initialize with saved selection from localStorage or default to all characters
    const savedSelection = localStorage.getItem('selectedCharacters');
    return savedSelection ? JSON.parse(savedSelection) : chars.map(char => char.id);
  });
  
  // Get only the selected characters
  const activeChars = chars.filter(char => selectedCharacters.includes(char.id));
  
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize dark mode based on user preference or system preference
    const savedMode = localStorage.getItem('yapDarkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to body when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    // Save preference to localStorage
    localStorage.setItem('yapDarkMode', darkMode);
  }, [darkMode]);

  // Save selected characters to localStorage when they change
  useEffect(() => {
    localStorage.setItem('selectedCharacters', JSON.stringify(selectedCharacters));
  }, [selectedCharacters]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Function to handle selected characters change
  const handleCharacterSelection = useCallback((characterIds) => {
    setSelectedCharacters(characterIds);
  }, []);

  // Function to navigate to character select page
  const handleChooseCharacters = useCallback(() => {
    setCurrentScreen('character-select');
  }, []);

  // Function to confirm character selection and return to previous screen
  const handleConfirmCharacters = useCallback(() => {
    setCurrentScreen('landing');
  }, []);

  // Function to go back from character select to previous screen
  const handleBackFromCharacterSelect = useCallback(() => {
    // If we have selected characters, just go back without saving
    // The selection is saved in the handleCharacterSelection function
    setCurrentScreen('landing');
  }, []);

  // Function to handle fetching responses for all characters - UPDATED to use sequential API calls
  const fetchAllResponses = useCallback(async (latestQuestion, currentHistory) => {
    setIsLoading(true);
    setCurrentScreen('loading'); // Show loading screen

    const newResponses = [];
    const updatedHistory = { ...currentHistory };

    // Use only selected characters
    for (const character of activeChars) {
      const characterId = character.id;
      
      try {
        console.log(`Starting API call for ${character.name}...`);
        
        // Add longer delay between each character (1-3 seconds)
        await delay(1000 + Math.random() * 2000);
        
        // Initialize history if it doesn't exist
        if (!updatedHistory[characterId]) {
          updatedHistory[characterId] = [];
        }

        // Add user question to this character's history
        updatedHistory[characterId] = [
          ...updatedHistory[characterId],
          { role: 'user', parts: [{ text: latestQuestion }] }
        ];

        // Make API call for this character
        const responseText = await getCharacterResponse(
          character,
          latestQuestion,
          currentHistory[characterId] || []
        );

        // Add model response to this character's history
        updatedHistory[characterId] = [
          ...updatedHistory[characterId],
          { role: 'model', parts: [{ text: responseText }] }
        ];

        newResponses.push({
          characterId: characterId,
          name: character.name,
          avatar: character.avatar,
          responseText: responseText,
        });
        
        console.log(`Completed API call for ${character.name}`);
        
      } catch (error) {
        console.error(`Failed to get response for ${character.name}:`, error);
        
        // Add user question to history anyway
        if (!updatedHistory[characterId]) {
          updatedHistory[characterId] = [];
        }
        
        if (!updatedHistory[characterId].some(msg => 
          msg.role === 'user' && msg.parts[0].text === latestQuestion)) {
          updatedHistory[characterId].push({ 
            role: 'user', 
            parts: [{ text: latestQuestion }] 
          });
        }
        
        // Add error response
        const errorText = `Sorry, ${character.name} is having trouble thinking right now.`;
        updatedHistory[characterId].push({ 
          role: 'model', 
          parts: [{ text: errorText }] 
        });
        
        newResponses.push({
          characterId: characterId,
          name: character.name,
          avatar: character.avatar,
          responseText: errorText,
        });
      }
    }

    setChatHistory(updatedHistory);
    setResponses(newResponses);
    setIsLoading(false);
    setCurrentScreen('response');
  }, [activeChars]); 

  const handleQuestionSubmit = useCallback((question) => {
    console.log("Initial question submitted:", question);
    setUserQuestion(question); // Store the initial question
    const initialUserMessage = { role: 'user', parts: [{ text: question }] };
    setCurrentConversation([initialUserMessage]); // Start conversation history
    setChatHistory({}); // Reset individual histories
    setResponses([]); // Clear previous responses
    fetchAllResponses(question, {}); // Pass empty initial history
  }, [fetchAllResponses]);

  const handleFollowUpSubmit = useCallback((followUpQuestion) => {
    console.log("Follow-up question submitted:", followUpQuestion);
    const newUserMessage = { role: 'user', parts: [{ text: followUpQuestion }] };
    // Add follow-up to the general conversation sequence if needed, though maybe not strictly necessary
    // setCurrentConversation(prev => [...prev, newUserMessage]);
    fetchAllResponses(followUpQuestion, chatHistory); // Pass current history
  }, [chatHistory, fetchAllResponses]);

  const handleSelectCharacter = useCallback((character) => {
      setSelectedCharacter(character);
  }, []);

  const handleClosePopup = useCallback(() => {
      setSelectedCharacter(null);
  }, []);

  // Implement handleEndChat function
  const handleEndChat = useCallback(() => {
    // Simply transition to the end screen
    setCurrentScreen('end');
  }, []);

  // Implement handleRestart function
  const handleRestart = useCallback(() => {
    // Reset all state back to initial values
    setUserQuestion('');
    setCurrentConversation([]);
    setChatHistory({});
    setResponses([]);
    setSelectedCharacter(null);
    // Return to landing page
    setCurrentScreen('landing');
  }, []);

  const renderScreen = () => {
    // Use isLoading state for LoadingScreen display
    if (isLoading) {
        return <LoadingScreen darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
    }

    switch (currentScreen) {
      case 'character-select':
        return (
          <CharacterSelectPage
            selected={selectedCharacters}
            onSelect={handleCharacterSelection}
            onConfirm={handleConfirmCharacters}
            onBack={handleBackFromCharacterSelect}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        );
      case 'response':
        return (
          <ResponseGrid
            userQuestion={userQuestion} // Pass initial question for display
            responses={responses}
            onSelectCharacter={handleSelectCharacter}
            onSubmitFollowUp={handleFollowUpSubmit}
            onEndChat={handleEndChat} // Now implemented and passed
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            onChooseCharacters={handleChooseCharacters} // Allow changing characters from response screen
          />
        );
      case 'end':
        return <EndScreen onRestart={handleRestart} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'landing':
      default:
        return (
          <LandingPage 
            onSubmitQuestion={handleQuestionSubmit} 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode}
            onChooseCharacters={handleChooseCharacters} // Pass the character selection handler
          />
        );
    }
  };

  return (
    <div className={`App ${darkMode ? 'dark-theme' : ''}`}>
      {renderScreen()}
      {selectedCharacter && (
        <ChatPopup
          character={selectedCharacter}
          history={chatHistory[selectedCharacter.id] || []}
          onClose={handleClosePopup}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

export default App;