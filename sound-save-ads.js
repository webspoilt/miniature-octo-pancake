// Sound Effects and Save System with AdSense Integration
// Optimized for free hosting on GitHub Pages

class SoundSystem {
    constructor() {
        this.sounds = {};
        this.muted = false;
        this.context = null;
        this.initAudioContext();
        this.loadSounds();
    }
    
    initAudioContext() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    loadSounds() {
        // Create synthetic sounds using Web Audio API (free!)
        this.createSyntheticSounds();
    }
    
    createSyntheticSounds() {
        // Jump sound - short ascending tone
        this.sounds.jump = () => {
            if (this.muted || !this.context) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.frequency.setValueAtTime(400, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, this.context.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + 0.1);
        };
        
        // Landing sound - low thud
        this.sounds.landing = () => {
            if (this.muted || !this.context) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.frequency.setValueAtTime(150, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + 0.05);
        };
        
        // Death sound - dramatic downward tone
        this.sounds.death = () => {
            if (this.muted || !this.context) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.frequency.setValueAtTime(300, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + 0.5);
        };
        
        // Achievement sound - uplifting melody
        this.sounds.achievement = () => {
            if (this.muted || !this.context) return;
            
            const frequencies = [523, 659, 784, 1047]; // C, E, G, C
            frequencies.forEach((freq, index) => {
                const oscillator = this.context.createOscillator();
                const gainNode = this.context.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.context.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.context.currentTime + index * 0.1);
                
                gainNode.gain.setValueAtTime(0, this.context.currentTime + index * 0.1);
                gainNode.gain.linearRampToValueAtTime(0.1, this.context.currentTime + index * 0.1 + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + index * 0.1 + 0.3);
                
                oscillator.start(this.context.currentTime + index * 0.1);
                oscillator.stop(this.context.currentTime + index * 0.1 + 0.3);
            });
        };
        
        // Button click sound
        this.sounds.click = () => {
            if (this.muted || !this.context) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.frequency.setValueAtTime(800, this.context.currentTime);
            
            gainNode.gain.setValueAtTime(0.05, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + 0.1);
        };
    }
    
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }
    
    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }
}

// Save System with Checkpoints
class SaveSystem {
    constructor() {
        this.saveKey = 'hells-gauntlet-save';
        this.checkpointKey = 'hells-gauntlet-checkpoint';
    }
    
    saveGame(gameData) {
        try {
            localStorage.setItem(this.saveKey, JSON.stringify({
                ...gameData,
                saveTime: new Date().toISOString(),
                version: '1.0'
            }));
            return true;
        } catch (e) {
            console.log('Save failed:', e);
            return false;
        }
    }
    
    loadGame() {
        try {
            const saved = localStorage.getItem(this.saveKey);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.log('Load failed:', e);
            return null;
        }
    }
    
    setCheckpoint(x, y) {
        try {
            localStorage.setItem(this.checkpointKey, JSON.stringify({
                x: x,
                y: y,
                timestamp: new Date().toISOString()
            }));
        } catch (e) {
            console.log('Checkpoint save failed:', e);
        }
    }
    
    getCheckpoint() {
        try {
            const checkpoint = localStorage.getItem(this.checkpointKey);
            return checkpoint ? JSON.parse(checkpoint) : null;
        } catch (e) {
            console.log('Checkpoint load failed:', e);
            return null;
        }
    }
    
    clearSave() {
        localStorage.removeItem(this.saveKey);
        localStorage.removeItem(this.checkpointKey);
    }
}

// Statistics tracking for achievements
const stats = {
    totalDeaths: 0,
    totalPlayTime: 0,
    levelsCompleted: 0,
    achievements: [],
    
    addDeath() {
        this.totalDeaths++;
        this.checkAchievements();
    },
    
    addPlayTime(seconds) {
        this.totalPlayTime += seconds;
        this.checkAchievements();
    },
    
    checkAchievements() {
        // Death milestones
        if (this.totalDeaths >= 10 && !this.achievements.includes('die_10_times')) {
            this.achievements.push('die_10_times');
            this.showAchievement('🎯 DIED 10 TIMES');
        }
        
        if (this.totalDeaths >= 50 && !this.achievements.includes('die_50_times')) {
            this.achievements.push('die_50_times');
            this.showAchievement('💀 DIED 50 TIMES');
        }
        
        if (this.totalDeaths >= 100 && !this.achievements.includes('die_100_times')) {
            this.achievements.push('die_100_times');
            this.showAchievement('🔥 DIED 100 TIMES');
        }
        
        // Playtime milestones
        if (this.totalPlayTime >= 300 && !this.achievements.includes('play_5_minutes')) {
            this.achievements.push('play_5_minutes');
            this.showAchievement('⏰ PLAYED 5 MINUTES');
        }
    },
    
    showAchievement(message) {
        const achievement = document.getElementById('achievement');
        if (achievement) {
            achievement.textContent = `ACHIEVEMENT UNLOCKED: ${message}`;
            achievement.classList.remove('hidden');
            
            setTimeout(() => {
                achievement.classList.add('hidden');
            }, 3000);
        }
    }
};

// Initialize systems
let soundSystem = new SoundSystem();
let saveSystem = new SaveSystem();

// AdSense Integration (Replace with your actual AdSense ID)
class AdSenseManager {
    constructor() {
        this.adsenseId = 'ca-pub-YOUR_ADSENSE_ID'; // Replace with your ID
        this.slotId = 'YOUR_SLOT_ID'; // Replace with your slot ID
        this.init();
    }
    
    init() {
        // Initialize AdSense when page loads
        if (typeof adsbygoogle !== 'undefined') {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }
    
    showInterstitialAd() {
        // Show interstitial ad (use sparingly to avoid user frustration)
        if (Math.random() < 0.1) { // 10% chance
            console.log('Showing interstitial ad...');
            // AdSense will handle this automatically
        }
    }
    
    showRewardedAd() {
        // This would require additional AdSense setup
        console.log('Rewarded ad would be shown here');
    }
}

// Initialize AdSense
let adSenseManager = new AdSenseManager();

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SoundSystem, SaveSystem, stats, AdSenseManager };
}