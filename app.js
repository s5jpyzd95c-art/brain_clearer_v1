class BrainClearer {
    constructor() {
        this.thoughts = [];
        this.recognition = null;
        this.init();
    }

    init() {
        this.loadTodayThoughts();
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        const speechBtn = document.getElementById('speechBtn');
        const textBtn = document.getElementById('textBtn');
        const clearBtn = document.getElementById('clearBtn');
        const submitBtn = document.getElementById('submitBtn');
        const closeModal = document.getElementById('closeModal');
        const cancelClear = document.getElementById('cancelClear');
        const confirmClear = document.getElementById('confirmClear');
        const okBtn = document.getElementById('okBtn');

        speechBtn.addEventListener('click', () => this.toggleRecording());
        textBtn.addEventListener('click', () => this.showTextModal());
        clearBtn.addEventListener('click', () => this.showClearModal());
        submitBtn.addEventListener('click', () => this.addThoughtFromInput());
        closeModal.addEventListener('click', () => this.hideModal('modal'));
        cancelClear.addEventListener('click', () => this.hideModal('clearModal'));
        confirmClear.addEventListener('click', () => this.clearThoughts());
        okBtn.addEventListener('click', () => this.hideModal('successModal'));

        document.getElementById('thoughtInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.addThoughtFromInput();
            }
        });
    }

    toggleRecording() {
        const speechBtn = document.getElementById('speechBtn');
        
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            
            if (!this.recognition) {
                this.recognition = new SpeechRecognition();
                this.recognition.lang = 'zh-CN';
                this.recognition.interimResults = false;
                this.recognition.continuous = false;

                this.recognition.onresult = (event) => {
                    const result = event.results[0][0].transcript;
                    if (result.trim()) {
                        const category = this.classifyThought(result);
                        this.addThought(result, category);
                    }
                    this.stopRecording();
                };

                this.recognition.onerror = () => {
                    this.stopRecording();
                    this.showTextModal();
                };

                this.recognition.onend = () => {
                    if (this.recognition && this.recognition.running) {
                        this.stopRecording();
                    }
                };
            }

            if (speechBtn.classList.contains('recording')) {
                this.stopRecording();
            } else {
                this.startRecording();
            }
        } else {
            this.showTextModal();
        }
    }

    startRecording() {
        const speechBtn = document.getElementById('speechBtn');
        speechBtn.classList.add('recording');
        speechBtn.textContent = '🔴 正在倾听...';
        this.recognition.start();
    }

    stopRecording() {
        const speechBtn = document.getElementById('speechBtn');
        speechBtn.classList.remove('recording');
        speechBtn.textContent = '🎤 开始说话';
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    showTextModal() {
        document.getElementById('thoughtInput').value = '';
        document.getElementById('modal').style.display = 'flex';
    }

    hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    showClearModal() {
        document.getElementById('clearModal').style.display = 'flex';
    }

    addThoughtFromInput() {
        const input = document.getElementById('thoughtInput');
        const text = input.value.trim();
        
        if (text) {
            const category = this.classifyThought(text);
            this.addThought(text, category);
            input.value = '';
            this.hideModal('modal');
        }
    }

    classifyThought(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('要') || lowerText.includes('需要') ||
            lowerText.includes('明天') || lowerText.includes('今天') ||
            lowerText.includes('必须') || lowerText.includes('记得') ||
            lowerText.includes('应该') || lowerText.includes('得')) {
            return 'todo';
        }
        
        if (lowerText.includes('担心') || lowerText.includes('怕') ||
            lowerText.includes('焦虑') || lowerText.includes('不安') ||
            lowerText.includes('烦') || lowerText.includes('愁')) {
            return 'worry';
        }
        
        return 'idea';
    }

    addThought(text, category) {
        const thought = {
            id: Date.now(),
            text: text,
            category: category,
            timestamp: new Date()
        };
        
        this.thoughts.push(thought);
        this.updateUI();
    }

    deleteThought(id) {
        this.thoughts = this.thoughts.filter(t => t.id !== id);
        this.updateUI();
    }

    clearThoughts() {
        this.saveTodayThoughts();
        this.thoughts = [];
        this.hideModal('clearModal');
        this.updateUI();
        document.getElementById('successModal').style.display = 'flex';
    }

    updateUI() {
        const emptyState = document.getElementById('emptyState');
        const thoughtsList = document.getElementById('thoughtsList');
        const thoughtsUl = document.getElementById('thoughtsUl');
        const clearBtn = document.getElementById('clearBtn');

        if (this.thoughts.length === 0) {
            emptyState.style.display = 'block';
            thoughtsList.style.display = 'none';
            clearBtn.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            thoughtsList.style.display = 'block';
            clearBtn.style.display = 'block';
            this.renderThoughts();
        }
    }

    renderThoughts() {
        const thoughtsUl = document.getElementById('thoughtsUl');
        thoughtsUl.innerHTML = '';

        const sortedThoughts = [...this.thoughts].reverse();

        sortedThoughts.forEach(thought => {
            const li = document.createElement('li');
            li.className = 'thought-item';
            li.innerHTML = `
                <span class="category category-${thought.category}">${this.getCategoryLabel(thought.category)}</span>
                <p class="thought-text">${this.escapeHtml(thought.text)}</p>
                <span class="thought-time">${this.formatTime(thought.timestamp)}</span>
                <button class="delete-btn" onclick="app.deleteThought(${thought.id})">×</button>
            `;
            thoughtsUl.appendChild(li);
        });
    }

    getCategoryLabel(category) {
        const labels = {
            todo: '待办',
            worry: '担心',
            idea: '想法'
        };
        return labels[category] || '想法';
    }

    formatTime(date) {
        const d = new Date(date);
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTodayThoughts() {
        const dateStr = this.getTodayStr();
        const thoughtDicts = this.thoughts.map(t => ({
            text: t.text,
            category: t.category,
            timestamp: t.timestamp.getTime()
        }));

        const allLogs = JSON.parse(localStorage.getItem('ThoughtLogs') || '{}');
        allLogs[dateStr] = thoughtDicts;
        localStorage.setItem('ThoughtLogs', JSON.stringify(allLogs));
    }

    loadTodayThoughts() {
        const dateStr = this.getTodayStr();
        const allLogs = JSON.parse(localStorage.getItem('ThoughtLogs') || '{}');
        
        if (allLogs[dateStr]) {
            this.thoughts = allLogs[dateStr].map(item => ({
                id: item.timestamp,
                text: item.text,
                category: item.category,
                timestamp: new Date(item.timestamp)
            }));
        }
    }

    getTodayStr() {
        const d = new Date();
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    }
}

const app = new BrainClearer();
