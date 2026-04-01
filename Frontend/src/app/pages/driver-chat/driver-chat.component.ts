import { Component, OnInit, OnDestroy, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { SystemStateService } from '../../services/system-state.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Message {
    text: string;
    type: 'user' | 'bot';
    time: Date;
    method?: 'voice' | 'text';
}

@Component({
    selector: 'app-driver-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './driver-chat.component.html',
    styleUrl: './driver-chat.component.css'
})
export class DriverChatComponent implements OnInit, OnDestroy {
    private socketService = inject(SocketService);
    public systemState = inject(SystemStateService);
    private ngZone = inject(NgZone);

    messages: Message[] = [
        {
            text: 'Hello! I am your AI Driving Assistant. Ask me anything about road safety or traffic rules.',
            type: 'bot',
            time: new Date()
        }
    ];
    userInput: string = '';
    isTyping: boolean = false;
    isListening: boolean = false;
    private subscription?: Subscription;
    private recognition: any;

    constructor() {
        this.initSpeechRecognition();
    }

    ngOnInit() {
        this.subscription = this.socketService.onBotResponse().subscribe((data: any) => {
            this.isTyping = false;
            this.messages.push({
                text: data.response,
                type: 'bot',
                time: new Date()
            });
            this.scrollToBottom();
            this.speak(data.response);
        });
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    private initSpeechRecognition() {
        const Window: any = window as any;
        const SpeechRecognition = Window.SpeechRecognition || Window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.ngZone.run(() => {
                    this.isListening = true;
                    this.systemState.isMicActive.set(true);
                });
            };

            this.recognition.onresult = (event: any) => {
                this.ngZone.run(() => {
                    const results = (event as any).results;
                    if (results && results[0] && results[0][0]) {
                        const transcript = results[0][0].transcript;
                        this.userInput = transcript;
                        this.sendMessage('voice');
                    }
                });
            };

            this.recognition.onerror = (event: any) => {
                this.ngZone.run(() => {
                    const error = (event as any).error;
                    console.error('Speech recognition error:', error);
                    this.isListening = false;
                    this.systemState.isMicActive.set(false);

                    if (error === 'no-speech') {
                        this.messages.push({
                            text: 'Sorry, I couldn\'t hear anything. Please try speaking again.',
                            type: 'bot',
                            time: new Date()
                        });
                    } else if (error === 'not-allowed') {
                        this.messages.push({
                            text: 'Microphone access denied. Please enable microphone permissions in your browser.',
                            type: 'bot',
                            time: new Date()
                        });
                    }
                });
            };

            this.recognition.onend = () => {
                this.ngZone.run(() => {
                    this.isListening = false;
                    this.systemState.isMicActive.set(false);
                });
            };
        } else {
            console.warn('Speech recognition not supported in this browser.');
        }
    }

    toggleListening() {
        if (this.isListening) {
            this.isListening = false;
            this.systemState.isMicActive.set(false);
            this.recognition.stop();
        } else {
            this.userInput = '';
            this.isListening = true;
            this.systemState.isMicActive.set(true);
            this.recognition.start();
        }
    }

    private speak(text: string) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    }

    sendMessage(method: 'voice' | 'text' = 'text') {
        if (!this.userInput.trim()) return;

        const userText = this.userInput;
        this.messages.push({
            text: userText,
            type: 'user',
            time: new Date(),
            method: method
        });

        this.socketService.sendMessage(userText);
        this.userInput = '';
        this.isTyping = true;
        this.scrollToBottom();
    }

    private scrollToBottom() {
        setTimeout(() => {
            const container = document.querySelector('.overflow-y-auto');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, 100);
    }
}
