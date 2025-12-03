

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from '@google/genai';

// --- DOM Elements ---
const appContainer = document.getElementById('app-container') as HTMLElement | null;
const themeToggleButton = document.getElementById('theme-toggle') as HTMLButtonElement | null;
const errorMessageElement = document.getElementById('error-message') as HTMLElement | null;

// View containers
const formView = document.getElementById('form-view') as HTMLDivElement | null;
const dashboardView = document.getElementById('dashboard-view') as HTMLDivElement | null;

// Form elements
const adsForm = document.getElementById('ads-form') as HTMLFormElement | null;
const analyzeButton = document.getElementById('analyze-button') as HTMLButtonElement | null;
const clearCacheButton = document.getElementById('clear-cache-button') as HTMLButtonElement | null;
const globalControlsFormView = document.getElementById('global-controls-form-view') as HTMLDivElement | null;

// Input fields - General Info
const websiteUrlInput = document.getElementById('website-url') as HTMLInputElement | null;
const aiFocusInstructionsInput = document.getElementById('ai-focus-instructions') as HTMLTextAreaElement | null;


// CSV File Inputs and Filename Displays
const campaignPerformanceCsvFileInput = document.getElementById('campaign-performance-csv-file') as HTMLInputElement | null;
const campaignPerformanceCsvFilename = document.getElementById('campaign-performance-csv-filename') as HTMLSpanElement | null;
const searchQueryReportCsvFileInput = document.getElementById('search-query-report-csv-file') as HTMLInputElement | null;
const searchQueryReportCsvFilename = document.getElementById('search-query-report-csv-filename') as HTMLSpanElement | null;
const adsScheduleLocationCsvFileInput = document.getElementById('ads-schedule-location-csv-file') as HTMLInputElement | null;
const adsScheduleLocationCsvFilename = document.getElementById('ads-schedule-location-csv-filename') as HTMLSpanElement | null;
const auctionInsightsCsvFileInput = document.getElementById('auction-insights-csv-file') as HTMLInputElement | null;
const auctionInsightsCsvFilename = document.getElementById('auction-insights-csv-filename') as HTMLSpanElement | null;
const locationPerformanceCsvFileInput = document.getElementById('location-performance-csv-file') as HTMLInputElement | null;
const locationPerformanceCsvFilename = document.getElementById('location-performance-csv-filename') as HTMLSpanElement | null;
const keywordPerformanceCsvFileInput = document.getElementById('keyword-performance-csv-file') as HTMLInputElement | null;
const keywordPerformanceCsvFilename = document.getElementById('keyword-performance-csv-filename') as HTMLSpanElement | null;
const adsCsvFileInput = document.getElementById('ads-csv-file') as HTMLInputElement | null;
const adsCsvFilename = document.getElementById('ads-csv-filename') as HTMLSpanElement | null;
const campaignSettingsCsvFileInput = document.getElementById('campaign-settings-csv-file') as HTMLInputElement | null;
const campaignSettingsCsvFilename = document.getElementById('campaign-settings-csv-filename') as HTMLSpanElement | null;
const adGroupSettingsCsvFileInput = document.getElementById('ad-group-settings-csv-file') as HTMLInputElement | null;
const adGroupSettingsCsvFilename = document.getElementById('ad-group-settings-csv-filename') as HTMLSpanElement | null;
const exclusionListsCsvFileInput = document.getElementById('exclusion-lists-csv-file') as HTMLInputElement | null;
const exclusionListsCsvFilename = document.getElementById('exclusion-lists-csv-filename') as HTMLSpanElement | null;
const conversionActionsCsvFileInput = document.getElementById('conversion-actions-csv-file') as HTMLInputElement | null;
const conversionActionsCsvFilename = document.getElementById('conversion-actions-csv-filename') as HTMLSpanElement | null;
const assetDetailsCsvFileInput = document.getElementById('asset-details-csv-file') as HTMLInputElement | null;
const assetDetailsCsvFilename = document.getElementById('asset-details-csv-filename') as HTMLSpanElement | null;


const CSV_INPUT_CONFIG = [
    { type: 'campaignPerformanceCsv', input: campaignPerformanceCsvFileInput, display: campaignPerformanceCsvFilename, name: 'Campaign Performance CSV' },
    { type: 'searchQueryReportCsv', input: searchQueryReportCsvFileInput, display: searchQueryReportCsvFilename, name: 'Search Query Report CSV' },
    { type: 'adsScheduleLocationCsv', input: adsScheduleLocationCsvFileInput, display: adsScheduleLocationCsvFilename, name: 'Segment Performance (Time, Demographics, Device, Audiences, Networks) CSV' },
    { type: 'auctionInsightsCsv', input: auctionInsightsCsvFileInput, display: auctionInsightsCsvFilename, name: 'Auction Insights CSV' },
    { type: 'locationPerformanceCsv', input: locationPerformanceCsvFileInput, display: locationPerformanceCsvFilename, name: 'Detailed Location Performance CSV' },
    { type: 'keywordPerformanceCsv', input: keywordPerformanceCsvFileInput, display: keywordPerformanceCsvFilename, name: 'Keyword Performance CSV' },
    { type: 'adsCsv', input: adsCsvFileInput, display: adsCsvFilename, name: 'Ads Performance & Creative Details CSV' },
    { type: 'campaignSettingsCsv', input: campaignSettingsCsvFileInput, display: campaignSettingsCsvFilename, name: 'Campaign Settings CSV' },
    { type: 'adGroupSettingsCsv', input: adGroupSettingsCsvFileInput, display: adGroupSettingsCsvFilename, name: 'Ad Group Settings CSV' },
    { type: 'exclusionListsCsv', input: exclusionListsCsvFileInput, display: exclusionListsCsvFilename, name: 'Exclusion Lists CSV' },
    { type: 'conversionActionsCsv', input: conversionActionsCsvFileInput, display: conversionActionsCsvFilename, name: 'Conversion Action Settings CSV' },
    { type: 'assetDetailsCsv', input: assetDetailsCsvFileInput, display: assetDetailsCsvFilename, name: 'Individual Asset Details CSV' }
];


// Dashboard Column Elements
const inputSummaryColumn = document.getElementById('input-summary-column') as HTMLDivElement | null;
const inputSummaryColumnContent = document.getElementById('input-summary-content') as HTMLDivElement | null;
const editInputsButton = document.getElementById('edit-inputs-button') as HTMLButtonElement | null;

const campaignAnalysisColumn = document.getElementById('campaign-analysis-column') as HTMLDivElement | null;
const campaignAnalysisColumnContent = document.getElementById('campaign-analysis-content') as HTMLDivElement | null;
const campaignAnalysisLoading = document.getElementById('campaign-analysis-loading') as HTMLDivElement | null;
const campaignAnalysisSourcesDiv = document.getElementById('campaign-analysis-sources') as HTMLDivElement | null;

const recommendationsColumn = document.getElementById('recommendations-column') as HTMLDivElement | null;
const recommendationsColumnContent = document.getElementById('results-content') as HTMLDivElement | null; 
const recommendationsLoading = document.getElementById('recommendations-loading') as HTMLDivElement | null;
const recommendationsSourcesDiv = document.getElementById('recommendations-sources') as HTMLDivElement | null;

const mainLoadingIndicator = document.getElementById('loading-indicator-main') as HTMLDivElement | null;

// Resizers
const resizer1 = document.getElementById('resizer-1') as HTMLDivElement | null;
const resizer2 = document.getElementById('resizer-2') as HTMLDivElement | null;

// Feedback Modal Elements
const feedbackModal = document.getElementById('feedback-modal') as HTMLDivElement | null;
const feedbackModalCloseButton = document.getElementById('feedback-modal-close') as HTMLButtonElement | null;
const feedbackModalRecTitle = document.getElementById('feedback-modal-rec-title') as HTMLParagraphElement | null;
const feedbackForm = document.getElementById('feedback-form') as HTMLFormElement | null;
const feedbackRecIdInput = document.getElementById('feedback-rec-id') as HTMLInputElement | null;
const feedbackTextInput = document.getElementById('feedback-text') as HTMLTextAreaElement | null;
const feedbackRatingSelect = document.getElementById('feedback-rating') as HTMLSelectElement | null;
const submitFeedbackButton = document.getElementById('submit-feedback-button') as HTMLButtonElement | null;


// --- Global Variables ---
let ai: GoogleGenAI | null = null;
let currentCampaignDataSnapshot: Record<string, string> = {}; // To store form data for summary
let uploadedCsvContents: Record<string, string> = {}; // To store text content of uploaded CSVs
let currentRecommendations: Recommendation[] = []; // To store the latest set of generated recommendations
let allGroundingSources: any[] = []; // To store all unique grounding sources

const FORM_INPUT_IDS: string[] = [ 
    'website-url', 'ai-focus-instructions',
    // File input IDs
    'campaign-performance-csv-file', 'search-query-report-csv-file', 'ads-schedule-location-csv-file',
    'auction-insights-csv-file', 'location-performance-csv-file', 'keyword-performance-csv-file', 
    'ads-csv-file', 'campaign-settings-csv-file', 'ad-group-settings-csv-file', 
    'exclusion-lists-csv-file', 'conversion-actions-csv-file', 'asset-details-csv-file'
];

interface RecommendationActionDetails {
    type: string;
    parameters: Record<string, any>; // This object MUST contain all specifics for the action.
}

interface Recommendation {
    id: string;
    category: string;
    priority: 'High' | 'Medium' | 'Low';
    title: string;
    rationale: string; // Should clearly explain the "why" and cite data.
    estimatedImpact: string;
    actionDetails: RecommendationActionDetails; // Should provide the "what" and "how".
    status?: 'applied' | 'dismissed';
    appliedTimestamp?: number;
    feedbackLogged?: boolean;
    feedbackText?: string;
    feedbackRating?: 'effective' | 'neutral' | 'ineffective' | '';
}

const MIN_COLUMN_WIDTH_PX = 150;
const COLUMN_WIDTHS_STORAGE_KEY = 'dashboardColumnWidths';


// --- Theme Management ---
function applyTheme(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggleButton) {
        themeToggleButton.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme as 'light' | 'dark');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme('light'); // Default theme
    }
}

// --- Form Caching (excluding file inputs) ---
function saveFormInput(inputId: string, value: string) {
    try {
        localStorage.setItem(`formcache_${inputId}`, value);
    } catch (e) {
        console.warn("Could not save to localStorage, possibly full or disabled.", e);
    }
}

function loadFormInputs() {
    FORM_INPUT_IDS.forEach(id => {
        // Skip file inputs for value loading
        if (id.endsWith('-csv-file')) return;

        const savedValue = localStorage.getItem(`formcache_${id}`);
        const element = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
        if (element && savedValue !== null) {
            element.value = savedValue;
        }
    });
}

function clearCachedForm() {
    FORM_INPUT_IDS.forEach(id => {
        localStorage.removeItem(`formcache_${id}`);
        // Skip file inputs for value clearing as they are handled by CSV_INPUT_CONFIG
        if (id.endsWith('-csv-file')) return;
        
        const element = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
        if (element) {
            if (element.tagName === 'SELECT') {
                (element as HTMLSelectElement).selectedIndex = 0;
            } else {
                element.value = '';
            }
        }
    });

    CSV_INPUT_CONFIG.forEach(config => {
        if (config.input) config.input.value = ''; 
        if (config.display) config.display.textContent = 'No file selected';
    });
    uploadedCsvContents = {}; 

    displayUserMessage('warning', 'Cached form data and uploaded files have been cleared.');
    switchToFormView(); 
    setTimeout(() => {
        if (errorMessageElement && errorMessageElement.textContent === 'Cached form data and uploaded files have been cleared.') {
            errorMessageElement.style.display = 'none';
        }
    }, 3000);
}

// --- File Upload Handling ---
function handleFileUpload(event: Event, csvTypeKey: string, displayNameElement: HTMLSpanElement | null) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
             displayUserMessage('warning', `Invalid file type for ${CSV_INPUT_CONFIG.find(c => c.type === csvTypeKey)?.name}. Please upload a .csv file.`, false);
            input.value = ''; 
            if (displayNameElement) displayNameElement.textContent = 'No file selected';
            uploadedCsvContents[csvTypeKey] = '';
            return;
        }

        if (displayNameElement) {
            displayNameElement.textContent = file.name;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedCsvContents[csvTypeKey] = e.target?.result as string;
             displayUserMessage('warning', `${file.name} content loaded.`, false); 
             setTimeout(() => { if (errorMessageElement && errorMessageElement.textContent === `${file.name} content loaded.`) errorMessageElement.style.display = 'none'; }, 2000);
        };
        reader.onerror = () => {
             displayUserMessage('error', `Error reading file: ${file.name}`, false);
            if (displayNameElement) displayNameElement.textContent = 'Error reading file';
            uploadedCsvContents[csvTypeKey] = '';
        };
        reader.readAsText(file);
    } else {
        if (displayNameElement) {
            displayNameElement.textContent = 'No file selected';
        }
        uploadedCsvContents[csvTypeKey] = '';
    }
}


// --- UI View Management ---
function switchToFormView() {
    if (formView) formView.style.display = 'flex';
    if (dashboardView) dashboardView.style.display = 'none';
    if (globalControlsFormView) globalControlsFormView.style.display = 'none'; // Hide as it was primarily for global comparison type
    if (analyzeButton) analyzeButton.disabled = false;
    if (mainLoadingIndicator) mainLoadingIndicator.style.display = 'none';
    if (campaignAnalysisColumnContent) campaignAnalysisColumnContent.innerHTML = '<p>Campaign analysis will appear here.</p>';
    if (recommendationsColumnContent) recommendationsColumnContent.innerHTML = '<p>Actionable recommendations will appear here.</p>';
    if (inputSummaryColumnContent) inputSummaryColumnContent.innerHTML = '';
    if (campaignAnalysisSourcesDiv) campaignAnalysisSourcesDiv.style.display = 'none';
    if (recommendationsSourcesDiv) recommendationsSourcesDiv.style.display = 'none';
    currentRecommendations = []; // Clear current recommendations when switching to form view
    allGroundingSources = []; // Clear all grounding sources
}

function switchToDashboardView() {
    loadColumnWidths(); 
    if (formView) formView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'flex';
    if (globalControlsFormView) globalControlsFormView.style.display = 'none'; 
    if (mainLoadingIndicator) mainLoadingIndicator.style.display = 'none';
}


// --- Utility Functions ---
function displayUserMessage(type: 'error' | 'warning', text: string, isGlobal: boolean = true) {
    if (errorMessageElement) {
        errorMessageElement.textContent = text;
        errorMessageElement.style.display = 'block';
        errorMessageElement.className = type === 'error' ? 'error-message-style' : 'warning-message-style';
        if (type === 'error' && isGlobal) {
             if (dashboardView && dashboardView.style.display === 'flex') {
                // Potentially do nothing or ensure it's visible above dashboard
            } else {
                switchToFormView();
            }
        }
    }
}

function escapeHtml(unsafe: string): string {
    if (typeof unsafe !== 'string') {
        console.warn('escapeHtml called with non-string value:', unsafe);
        return String(unsafe); // Convert to string before escaping
    }
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function populateInputSummary() {
    if (!inputSummaryColumnContent) return;
    let summaryHtml = '';
    const friendlyNames: Record<string, string> = {
        'websiteUrl': 'Website URL',
        'aiFocusInstructions': 'AI Analysis Focus',
    };

    for (const key in currentCampaignDataSnapshot) {
        // Only display Website URL and AI Focus from the snapshot directly
        if (key === 'websiteUrl' || key === 'aiFocusInstructions') {
            const value = currentCampaignDataSnapshot[key];
            const name = friendlyNames[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            if (value && value.trim() !== '') {
                summaryHtml += `<p><strong>${escapeHtml(name)}:</strong> ${escapeHtml(value)}</p>`;
            }
        }
    }
    
    CSV_INPUT_CONFIG.forEach(config => {
        const fileName = config.display?.textContent || 'Not Provided';
        const contentAvailable = uploadedCsvContents[config.type] && uploadedCsvContents[config.type].trim() !== '';
        const status = contentAvailable ? `File: ${escapeHtml(fileName)} (Content Loaded)` : (fileName !== 'No file selected' && fileName !== 'Not Provided' ? `File: ${escapeHtml(fileName)} (Pending/Error)` : 'Not Provided');
        summaryHtml += `<p><strong>${escapeHtml(config.name)}:</strong> ${status}</p>`;
    });

    inputSummaryColumnContent.innerHTML = summaryHtml || '<p>No data provided beyond CSVs.</p>';
}


// --- Recommendation Card Rendering & Feedback Modal ---
function updateRecommendationCardDisplay(card: HTMLElement, rec: Recommendation) {
    const applyButton = card.querySelector('.apply-button') as HTMLButtonElement | null;
    const dismissButton = card.querySelector('.dismiss-button') as HTMLButtonElement | null;
    const logFeedbackButton = card.querySelector('.log-feedback-button') as HTMLButtonElement | null;
    const statusDiv = card.querySelector('.card-status') as HTMLElement | null;
    let feedbackDisplayDiv = card.querySelector('.card-feedback-display') as HTMLElement | null;

    // Reset classes and buttons
    card.classList.remove('applied', 'dismissed');
    if (applyButton) {
        applyButton.disabled = false;
        applyButton.innerHTML = `<span class="icon">✔️</span> Apply`;
        applyButton.style.display = 'inline-flex';
    }
    if (dismissButton) {
        dismissButton.disabled = false;
        dismissButton.innerHTML = `<span class="icon">✖️</span> Dismiss`;
        dismissButton.style.display = 'inline-flex';
    }
    if (logFeedbackButton) logFeedbackButton.style.display = 'none';
    if (statusDiv) statusDiv.textContent = '';
    if (feedbackDisplayDiv) feedbackDisplayDiv.remove();


    if (rec.status === 'applied') {
        card.classList.add('applied');
        if (statusDiv) statusDiv.textContent = 'Applied';
        if (applyButton) {
            applyButton.innerHTML = `<span class="icon">✔️</span> Applied`;
            applyButton.disabled = true;
        }
        if (dismissButton) dismissButton.style.display = 'none';
        if (logFeedbackButton && !rec.feedbackLogged) {
            logFeedbackButton.style.display = 'inline-flex';
            logFeedbackButton.disabled = false;
        } else if (logFeedbackButton && rec.feedbackLogged) {
            logFeedbackButton.style.display = 'none'; // Hide if feedback logged
        }
    } else if (rec.status === 'dismissed') {
        card.classList.add('dismissed');
        if (statusDiv) statusDiv.textContent = 'Dismissed';
        if (dismissButton) {
            dismissButton.innerHTML = `<span class="icon">✖️</span> Dismissed`;
            dismissButton.disabled = true;
        }
        if (applyButton) applyButton.style.display = 'none';
        if (logFeedbackButton) logFeedbackButton.style.display = 'none';
    }

    if (rec.feedbackLogged && rec.feedbackText) {
        if (!feedbackDisplayDiv) {
            feedbackDisplayDiv = document.createElement('div');
            feedbackDisplayDiv.className = 'card-feedback-display';
            const cardBody = card.querySelector('.card-body');
            cardBody?.insertAdjacentElement('afterend', feedbackDisplayDiv); // Insert after body, before actions
        }
        let ratingText = rec.feedbackRating ? rec.feedbackRating.charAt(0).toUpperCase() + rec.feedbackRating.slice(1) : 'N/A';
        feedbackDisplayDiv.innerHTML = `
            <p><strong>Feedback:</strong> ${escapeHtml(rec.feedbackText)}</p>
            <p><strong>Effectiveness:</strong> ${escapeHtml(ratingText)}</p>
        `;
        if (logFeedbackButton) logFeedbackButton.style.display = 'none'; // Hide if feedback logged
    }
}

function renderParameterValueHtml(value: any): string {
    if (typeof value === 'string') {
        return escapeHtml(value);
    } else if (Array.isArray(value)) {
        if (value.length === 0) return '<em>(empty list)</em>';
        let listHtml = '<ul>';
        value.forEach(item => {
            listHtml += `<li>${renderParameterValueHtml(item)}</li>`;
        });
        listHtml += '</ul>';
        return listHtml;
    } else if (typeof value === 'object' && value !== null) {
        if (Object.keys(value).length === 0) return '<em>(empty object)</em>';
        let objectHtml = '<ul>';
        for (const subKey in value) {
            objectHtml += `<li><strong>${escapeHtml(subKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))}:</strong> ${renderParameterValueHtml(value[subKey])}</li>`;
        }
        objectHtml += '</ul>';
        return objectHtml;
    } else if (value === null || value === undefined) {
        return '<em>N/A</em>';
    }
    return escapeHtml(String(value));
}


function createRecommendationCard(rec: Recommendation): HTMLElement {
    const card = document.createElement('div');
    card.className = `recommendation-card priority-${rec.priority.toLowerCase()}`;
    card.setAttribute('role', 'article');
    card.setAttribute('aria-labelledby', `rec-title-${rec.id}`);
    card.setAttribute('data-id', rec.id);

    const title = escapeHtml(rec.title);
    const category = escapeHtml(rec.category);
    const rationale = escapeHtml(rec.rationale); 
    const estimatedImpact = escapeHtml(rec.estimatedImpact);

    let actionDetailsHtml = '<p class="card-action-title"><strong>Action Proposed (Blueprint for Manual Implementation):</strong></p>';
    if (rec.actionDetails && rec.actionDetails.type) {
        actionDetailsHtml += `<p><strong>Type:</strong> ${escapeHtml(rec.actionDetails.type)}</p>`;
        if (rec.actionDetails.parameters && Object.keys(rec.actionDetails.parameters).length > 0) {
            actionDetailsHtml += '<ul>';
            for (const key in rec.actionDetails.parameters) {
                actionDetailsHtml += `<li><strong>${escapeHtml(key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))}:</strong> ${renderParameterValueHtml(rec.actionDetails.parameters[key])}</li>`;
            }
            actionDetailsHtml += '</ul>';
        } else {
            actionDetailsHtml += '<p><em>No specific parameters detailed for this action.</em></p>';
        }
    } else {
        actionDetailsHtml += '<p><em>No specific action type detailed.</em></p>';
    }


    card.innerHTML = `
        <div class="card-header">
            <h3 id="rec-title-${rec.id}" class="card-title">${title}</h3>
            <span class="card-category ${category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}">${category}</span>
            <span class="card-priority">${rec.priority}</span>
        </div>
        <div class="card-body">
            <p class="card-rationale"><strong>Rationale (Why this is important):</strong> ${rationale}</p>
            <p class="card-impact"><strong>Est. Impact:</strong> <em>${estimatedImpact}</em></p>
            <div class="card-action-details">
                ${actionDetailsHtml}
            </div>
        </div>
        <div class="card-actions">
            <button class="card-button apply-button" aria-label="Apply recommendation: ${title}">
                <span class="icon">✔️</span> Apply
            </button>
            <button class="card-button log-feedback-button" style="display:none;" aria-label="Log feedback for recommendation: ${title}">
                <span class="icon">📝</span> Log Feedback
            </button>
            <button class="card-button dismiss-button" aria-label="Dismiss recommendation: ${title}">
                <span class="icon">✖️</span> Dismiss
            </button>
        </div>
        <div class="card-status" aria-live="polite"></div>
    `;

    const applyButton = card.querySelector('.apply-button') as HTMLButtonElement;
    const dismissButton = card.querySelector('.dismiss-button') as HTMLButtonElement;
    const logFeedbackButton = card.querySelector('.log-feedback-button') as HTMLButtonElement;

    applyButton.addEventListener('click', () => {
        rec.status = 'applied';
        rec.appliedTimestamp = Date.now();
        console.log(`Recommendation Marked as Applied by User: ${rec.title}`, rec.actionDetails);
        displayUserMessage('warning', `Marked '${rec.title}' as applied. Remember to implement these changes in your Google Ads account.`, false);
        setTimeout(() => {
            if (errorMessageElement && errorMessageElement.textContent?.includes(`Marked '${rec.title}' as applied`)) {
                errorMessageElement.style.display = 'none';
            }
        }, 4000);
        updateRecommendationCardDisplay(card, rec);
    });

    dismissButton.addEventListener('click', () => {
        rec.status = 'dismissed';
        console.log(`Recommendation Dismissed: ${rec.title}`);
        updateRecommendationCardDisplay(card, rec);
    });
    
    logFeedbackButton.addEventListener('click', () => {
        openFeedbackModal(rec.id);
    });
    
    updateRecommendationCardDisplay(card, rec); // Initial display based on rec state
    return card;
}

function openFeedbackModal(recId: string) {
    const rec = currentRecommendations.find(r => r.id === recId);
    if (!rec || !feedbackModal || !feedbackModalRecTitle || !feedbackRecIdInput || !feedbackForm || !feedbackTextInput || !feedbackRatingSelect) return;

    feedbackModalRecTitle.textContent = rec.title;
    feedbackRecIdInput.value = recId;
    feedbackTextInput.value = rec.feedbackText || '';
    feedbackRatingSelect.value = rec.feedbackRating || '';
    
    feedbackModal.style.display = 'block';
    document.body.classList.add('modal-open');
    feedbackTextInput.focus();
}

function closeFeedbackModal() {
    if (!feedbackModal || !feedbackForm) return;
    feedbackForm.reset();
    feedbackModal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

function handleFeedbackSubmit(event: Event) {
    event.preventDefault();
    if (!feedbackRecIdInput || !feedbackTextInput || !feedbackRatingSelect) return;

    const recId = feedbackRecIdInput.value;
    const rec = currentRecommendations.find(r => r.id === recId);
    if (!rec) {
        displayUserMessage('error', "Could not find recommendation to update feedback.", false);
        return;
    }

    rec.feedbackLogged = true;
    rec.feedbackText = feedbackTextInput.value;
    rec.feedbackRating = feedbackRatingSelect.value as Recommendation['feedbackRating'];

    const card = document.querySelector(`.recommendation-card[data-id="${recId}"]`) as HTMLElement | null;
    if (card) {
        updateRecommendationCardDisplay(card, rec);
    }
    closeFeedbackModal();
    displayUserMessage('warning', 'Feedback logged successfully.', false);
    setTimeout(() => {
        if (errorMessageElement && errorMessageElement.textContent === 'Feedback logged successfully.') {
            errorMessageElement.style.display = 'none';
        }
    }, 2000);
}

// --- Enhanced Campaign Analysis Display ---
function convertMarkdownToHtmlInline(text: string): string {
    let html = escapeHtml(text);
    // Bold and Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Highlight key metrics patterns
    html = html.replace(
        /(\b(?:Impressions|Clicks|CTR|Avg\. CPC|Conversions|Cost\/Conversion|Impression Share|Quality Score|Budget Spent|Monthly Budget|Days Remaining|ROAS|Projected|Estimated|vs\.|Source|Date|Age|Gender|Household Income|Device|Network|Asset|Campaign Goal|Bid Strategy|Ad Rotation|Targeting Setting|Exclusion Status|Conversion Action|Attribution Model)\b\s*:\s*)([\d.,%$\s\/a-zA-Z()-]+(?:\s*\(Comparison:.*?\))?)/gi,
        '<span class="metric-highlight"><span class="metric-label">$1</span><span class="metric-value">$2</span></span>'
    );
    // Simpler form for terms like "Keyword: 'Example Keyword'" or "Campaign: Campaign Name"
    html = html.replace(
        /(\b(?:Keyword|Search Term|Campaign|Ad Group|Location|Competitor|Match Type|Segment|Theme|Strategy|Objective|Industry|Benchmark|Risk|Opportunity|Goal|Audience|Placement|Exclusion|Policy|Asset Type|Conversion Source|Conversion Category|Primary Conversion)\b\s*:\s*)((?:'[^']+'|"[^"]+"|\b[\w\s-]+(?:\s*\(.*?\))?))/gi,
        '<span class="term-highlight"><span class="term-label">$1</span><span class="term-value">$2</span></span>'
    );
    
    // Highlight Quality Score values specifically if they appear like (X/10)
    html = html.replace(
        /(\(\s*)(\d+\/10)(\s*\))/gi,
        (match, p1, p2, p3) => {
            const score = parseInt(p2.split('/')[0]);
            let scoreClass = 'qs-neutral';
            if (score <= 4) scoreClass = 'qs-low';
            else if (score >= 8) scoreClass = 'qs-high';
            else if (score >= 5) scoreClass = 'qs-medium';
            return `${p1}<span class="${scoreClass}">${p2}</span>${p3}`;
        }
    );
     // Highlight percentages for emphasis
    html = html.replace(/(\b\d+(\.\d+)?%)(?!\s*vs\.)/g, '<span class="percentage-value">$1</span>');


    return html;
}

function getSectionIcon(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('overall campaign health') || lowerTitle.includes('kpi assessment') || lowerTitle.includes('future projections')) return '❤️';
    if (lowerTitle.includes('campaign & ad group performance')) return '📊';
    if (lowerTitle.includes('search query') || lowerTitle.includes('keyword relevance')) return '🔑';
    if (lowerTitle.includes('ad performance') || lowerTitle.includes('creative analysis') || lowerTitle.includes('asset effectiveness')) return '🖼️';
    if (lowerTitle.includes('audience & demographic')) return '👥';
    if (lowerTitle.includes('device, network')) return '💻';
    if (lowerTitle.includes('competitive landscape') || lowerTitle.includes('auction insights')) return '⚔️';
    if (lowerTitle.includes('geographic performance') || lowerTitle.includes('location performance')) return '🌍';
    if (lowerTitle.includes('ad scheduling') || lowerTitle.includes('when and where')) return '⏰';
    if (lowerTitle.includes('exclusion list audit') || lowerTitle.includes('negative keyword') || lowerTitle.includes('placement exclusion')) return '🛡️';
    if (lowerTitle.includes('campaign settings analysis') || lowerTitle.includes('goal alignment')) return '⚙️';
    if (lowerTitle.includes('ad group settings analysis') || lowerTitle.includes('targeting setup')) return '🎯';
    if (lowerTitle.includes('conversion tracking') || lowerTitle.includes('action settings')) return '📈';
    if (lowerTitle.includes('synthesize & diagnose')) return '🧠';
    if (lowerTitle.includes('user\'s special focus') || lowerTitle.includes('instructions')) return '🎯';
    return '📋'; // Default icon
}


function displayCampaignAnalysis(analysisText: string, container: HTMLElement | null) {
    if (!container) return;
    container.innerHTML = ''; // Clear previous content

    // Split by lines that look like "1. **SECTION TITLE:**" or "**1. SECTION TITLE:**" or "USER'S SPECIAL..." etc.
    const sectionDelimiterRegex = /\n(?=\d+\.\s*\*.*?\*\*|\*\*\d+\..*?\*\*|USER'S SPECIAL FOCUS\/INSTRUCTIONS:)/;
    const rawSections = analysisText.split(sectionDelimiterRegex);

    rawSections.forEach(sectionText => {
        if (sectionText.trim() === '') return;

        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'analysis-section';
        
        const lines = sectionText.trim().split('\n');
        let currentParagraph = '';
        let listHtml = '';
        let inList = false;

        // Extract and style title for the section
        const firstLine = lines.shift() || ''; 
        const titleElem = document.createElement('h3');
        titleElem.className = 'analysis-section-title';
        const icon = getSectionIcon(firstLine);
        titleElem.innerHTML = `${icon} ${convertMarkdownToHtmlInline(firstLine.replace(/^\d+\.\s*/, ''))}`; 
        sectionDiv.appendChild(titleElem);

        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'analysis-section-body';

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ') || /^\d+\.\s/.test(trimmedLine)) {
                if (currentParagraph) { 
                    bodyDiv.innerHTML += `<p>${convertMarkdownToHtmlInline(currentParagraph)}</p>`;
                    currentParagraph = '';
                }
                if (!inList) {
                    listHtml += '<ul>';
                    inList = true;
                }
                listHtml += `<li>${convertMarkdownToHtmlInline(trimmedLine.replace(/^(- |\* |\d+\.\s)/, ''))}</li>`;
            } else {
                if (inList) { 
                    listHtml += '</ul>';
                    bodyDiv.innerHTML += listHtml;
                    listHtml = '';
                    inList = false;
                }
                if (trimmedLine === '') { 
                    if (currentParagraph) {
                        bodyDiv.innerHTML += `<p>${convertMarkdownToHtmlInline(currentParagraph)}</p>`;
                        currentParagraph = '';
                    }
                } else {
                    currentParagraph += (currentParagraph ? ' ' : '') + line; 
                }
            }
        });

        if (currentParagraph) { 
            bodyDiv.innerHTML += `<p>${convertMarkdownToHtmlInline(currentParagraph)}</p>`;
        }
        if (inList) { 
            listHtml += '</ul>';
            bodyDiv.innerHTML += listHtml;
        }
        
        sectionDiv.appendChild(bodyDiv);
        container.appendChild(sectionDiv);
    });
     if (container.innerHTML === '') { 
        container.innerHTML = `<p>${convertMarkdownToHtmlInline(analysisText)}</p>`; // Fallback for non-sectioned or problematic AI output
    }
}


function displayGroundingSources(newSources: any[], targetDiv: HTMLElement | null, existingSourcesList: any[]) {
    if (!targetDiv) return;

    let sourcesToDisplay = newSources.filter(
        gChunk => gChunk.web?.uri && !existingSourcesList.some(existingChunk => existingChunk.web?.uri === gChunk.web?.uri)
    );

    if (sourcesToDisplay.length === 0 && existingSourcesList.length === 0) {
        targetDiv.style.display = 'none';
        return;
    }
    
    // Add to global list
    sourcesToDisplay.forEach(s => existingSourcesList.push(s));
    
    // Display all unique sources
    if (existingSourcesList.length > 0) {
        let sourcesHtmlList = '<ul>';
        existingSourcesList.forEach(gChunk => {
            if (gChunk.web && gChunk.web.uri) {
                const title = gChunk.web.title || gChunk.web.uri;
                try {
                    new URL(gChunk.web.uri); 
                    sourcesHtmlList += `<li><a href="${escapeHtml(gChunk.web.uri)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a></li>`;
                } catch (e) {
                    console.warn(`Invalid URI found in grounding data: ${gChunk.web.uri}`);
                    sourcesHtmlList += `<li>${escapeHtml(title)} (Source URI not a valid link: ${escapeHtml(gChunk.web.uri)})</li>`;
                }
            }
        });
        sourcesHtmlList += '</ul>';

        if (targetDiv.id === 'campaign-analysis-sources') {
            targetDiv.innerHTML = sourcesHtmlList; // No H3 heading for campaign analysis sources
        } else {
            targetDiv.innerHTML = `<h3>Sources Consulted (Potentially by AI)</h3>${sourcesHtmlList}`;
        }
        targetDiv.style.display = 'block';
    } else {
        targetDiv.style.display = 'none';
    }
}

// --- Column Resizing Logic ---
let activeResizerElement: HTMLElement | null = null;
let initialMouseXPos: number = 0;
let leftColElement: HTMLElement | null = null;
let rightColElement: HTMLElement | null = null;
let initialLeftColWidth: number = 0;
let initialRightColWidth: number = 0;

function onResizerMouseDown(event: MouseEvent) {
    activeResizerElement = event.target as HTMLElement;
    activeResizerElement.classList.add('active-resizer');
    document.body.classList.add('is-resizing');

    initialMouseXPos = event.clientX;
    leftColElement = activeResizerElement.previousElementSibling as HTMLElement;
    rightColElement = activeResizerElement.nextElementSibling as HTMLElement;

    if (!leftColElement || !rightColElement || !dashboardView) {
        console.error("Resizer or adjacent columns not found");
        return;
    }

    initialLeftColWidth = leftColElement.offsetWidth;
    initialRightColWidth = rightColElement.offsetWidth;
    
    leftColElement.style.flexGrow = '0';
    leftColElement.style.flexShrink = '0';
    rightColElement.style.flexGrow = '0';
    rightColElement.style.flexShrink = '0';

    document.addEventListener('mousemove', onResizerMouseMove);
    document.addEventListener('mouseup', onResizerMouseUp);
}

function onResizerMouseMove(event: MouseEvent) {
    if (!activeResizerElement || !leftColElement || !rightColElement) return;

    const deltaX = event.clientX - initialMouseXPos;
    let newLeftWidth = initialLeftColWidth + deltaX;
    let newRightWidth = initialRightColWidth - deltaX;

    if (newLeftWidth < MIN_COLUMN_WIDTH_PX) {
        newLeftWidth = MIN_COLUMN_WIDTH_PX;
        newRightWidth = (initialLeftColWidth + initialRightColWidth) - newLeftWidth;
    }
    if (newRightWidth < MIN_COLUMN_WIDTH_PX) {
        newRightWidth = MIN_COLUMN_WIDTH_PX;
        newLeftWidth = (initialLeftColWidth + initialRightColWidth) - newRightWidth;
    }
    
    const totalResizableWidth = initialLeftColWidth + initialRightColWidth;
    if (newLeftWidth + newRightWidth > totalResizableWidth + 2) { 
        if (deltaX > 0) { 
            newRightWidth = totalResizableWidth - newLeftWidth;
        } else { 
            newLeftWidth = totalResizableWidth - newRightWidth;
        }
    }

    leftColElement.style.flexBasis = `${newLeftWidth}px`;
    rightColElement.style.flexBasis = `${newRightWidth}px`;
}

function onResizerMouseUp() {
    if (activeResizerElement) {
        activeResizerElement.classList.remove('active-resizer');
    }
    document.body.classList.remove('is-resizing');

    if (leftColElement) {
        leftColElement.style.flexGrow = '1';
        leftColElement.style.flexShrink = '1';
    }
    if (rightColElement) {
        rightColElement.style.flexGrow = '1';
        rightColElement.style.flexShrink = '1';
    }

    saveColumnWidths();

    activeResizerElement = null;
    leftColElement = null;
    rightColElement = null;
    document.removeEventListener('mousemove', onResizerMouseMove);
    document.removeEventListener('mouseup', onResizerMouseUp);
}

function saveColumnWidths() {
    if (inputSummaryColumn && campaignAnalysisColumn && recommendationsColumn) {
        const widths = {
            inputSummary: inputSummaryColumn.style.flexBasis || getComputedStyle(inputSummaryColumn).flexBasis,
            campaignAnalysis: campaignAnalysisColumn.style.flexBasis || getComputedStyle(campaignAnalysisColumn).flexBasis,
            recommendations: recommendationsColumn.style.flexBasis || getComputedStyle(recommendationsColumn).flexBasis,
        };
        try {
            localStorage.setItem(COLUMN_WIDTHS_STORAGE_KEY, JSON.stringify(widths));
        } catch (e) {
            console.warn("Could not save column widths to localStorage:", e);
        }
    }
}

function loadColumnWidths() {
    try {
        const savedWidthsJSON = localStorage.getItem(COLUMN_WIDTHS_STORAGE_KEY);
        if (savedWidthsJSON) {
            const savedWidths = JSON.parse(savedWidthsJSON);
            if (inputSummaryColumn && savedWidths.inputSummary) inputSummaryColumn.style.flexBasis = savedWidths.inputSummary;
            if (campaignAnalysisColumn && savedWidths.campaignAnalysis) campaignAnalysisColumn.style.flexBasis = savedWidths.campaignAnalysis;
            if (recommendationsColumn && savedWidths.recommendations) recommendationsColumn.style.flexBasis = savedWidths.recommendations;
        }
    } catch (e) {
        console.warn("Could not load or parse column widths from localStorage:", e);
    }
}

// --- Export Functionality ---
function exportColumnAsText(targetContentId: string, title: string) {
    const contentElement = document.getElementById(targetContentId);
    if (!contentElement) {
        displayUserMessage('error', `Could not find content for export: ${targetContentId}`, false);
        return;
    }
    const textContent = contentElement.innerText || contentElement.textContent || '';
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, '_')}_export.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function printColumnContent(targetContentId: string, title: string) {
    const contentElement = document.getElementById(targetContentId);
    if (!contentElement) {
        displayUserMessage('error', `Could not find content for printing: ${targetContentId}`, false);
        return;
    }
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`<html><head><title>${escapeHtml(title)}</title>`);
        // Basic styling for print - consider adding more from main CSS if needed
        printWindow.document.write('<style>');
        printWindow.document.write(`
            body { font-family: 'Roboto', sans-serif; line-height: 1.5; color: #333; margin: 20px;} 
            h1, h2, h3 { color: #023E8A; } 
            strong { font-weight: bold; } 
            em { font-style: italic; }
            ul { margin-left: 20px; list-style-position: inside;}
            .recommendation-card { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; break-inside: avoid-page; }
            .card-title { font-size: 1.1em; font-weight: bold; }
            .card-priority { font-weight: bold; }
            .priority-high .card-priority { color: #C91A29; }
            .priority-medium .card-priority { color: #D68400; }
            .priority-low .card-priority { color: #00875A; }
            .card-feedback-display { margin-top: 5px; padding: 5px; border: 1px dashed #ddd; font-size: 0.9em; }
            .analysis-section { border: 1px solid #eee; padding: 10px; margin-bottom: 15px; break-inside: avoid-page; }
            .analysis-section-title { font-size: 1.2em; color: #023E8A; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;}
            .metric-highlight { background-color: #e9f5f9; padding: 2px 4px; border-radius: 3px; }
            .metric-label { font-weight: bold; }
            .metric-value { color: #0077B6; }
            .percentage-value { font-weight: bold; color: #0077B6; }
            .qs-low { color: #C91A29; font-weight: bold; }
            .qs-medium { color: #D68400; font-weight: bold; }
            .qs-high { color: #00875A; font-weight: bold; }
            .card-action-details ul { padding-left: 15px; margin-left: 0;}
            .card-action-details ul ul { padding-left: 10px; margin-left: 0;}
            /* Hide buttons for print */
            .card-actions, .column-export-buttons, #edit-inputs-button { display: none !important; }

        `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write(`<h1>${escapeHtml(title)}</h1>`);
        printWindow.document.write(contentElement.innerHTML); // Copy innerHTML to try and preserve some formatting
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        // Delay print slightly to allow content to render
        setTimeout(() => {
            printWindow.print();
            // printWindow.close(); // Optional: close after print
        }, 250);
    } else {
        displayUserMessage('error', 'Could not open print window. Please check your browser pop-up settings.', false);
    }
}


// --- Main Application Logic ---
function initializeApp(): boolean {
    console.log("initializeApp: Script execution started.");
    loadTheme();
    loadFormInputs();
    loadColumnWidths(); 
    switchToFormView(); 

    const formElementsToDisable: (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null)[] = [
        websiteUrlInput, aiFocusInstructionsInput,
        ...CSV_INPUT_CONFIG.map(c => c.input) // This now includes all CSV inputs
    ];

    const criticalDOMElements: (HTMLElement | null)[] = [
        adsForm, analyzeButton, mainLoadingIndicator, errorMessageElement, appContainer,
        themeToggleButton, clearCacheButton, formView, dashboardView,
        inputSummaryColumn, inputSummaryColumnContent, campaignAnalysisColumn, campaignAnalysisColumnContent,
        recommendationsColumn, recommendationsColumnContent,
        campaignAnalysisLoading, recommendationsLoading, editInputsButton,
        resizer1, resizer2,
        feedbackModal, feedbackModalCloseButton, feedbackModalRecTitle, feedbackForm, 
        feedbackRecIdInput, feedbackTextInput, feedbackRatingSelect, submitFeedbackButton,
        globalControlsFormView, // Keep for theme toggle positioning, even if select is gone
        ...formElementsToDisable, 
        ...CSV_INPUT_CONFIG.map(c => c.display) 
    ];

    if (criticalDOMElements.some(el => !el)) {
        console.error("One or more critical DOM elements are missing. Application cannot start.");
        if (errorMessageElement) {
             errorMessageElement.textContent = "Fatal Error: Required HTML elements not found. The page might be corrupted or incomplete.";
             errorMessageElement.style.display = 'block';
             errorMessageElement.className = 'error-message-style';
        }
        if(analyzeButton) analyzeButton.disabled = true;
        return false;
    }
    
    if (typeof process === 'undefined' || !process.env || typeof process.env.API_KEY !== 'string' || process.env.API_KEY.trim() === '') {
        displayUserMessage('error', "Critical Setup Error: API_KEY is missing or invalid in process.env. This application requires this environment variable to be set for Gemini AI access.");
        if (analyzeButton) { analyzeButton.disabled = true; analyzeButton.textContent = "API Key Missing"; }
        formElementsToDisable.forEach(el => { if (el) el.disabled = true; });
        return false;
    }

    try {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } catch (e) {
        console.error("Failed to initialize GoogleGenAI SDK:", e);
        const errorMsg = e instanceof Error ? e.message : String(e);
        displayUserMessage('error', `Critical Setup Error: Failed to initialize AI SDK. ${errorMsg}. Ensure API_KEY in process.env is valid.`);
        if (analyzeButton) { analyzeButton.disabled = true; analyzeButton.textContent = "SDK Init Error"; }
        formElementsToDisable.forEach(el => { if (el) el.disabled = true; });
        return false;
    }

    if (themeToggleButton) themeToggleButton.addEventListener('click', toggleTheme);
    if (clearCacheButton) clearCacheButton.addEventListener('click', clearCachedForm);
    if (editInputsButton) editInputsButton.addEventListener('click', switchToFormView);

    [resizer1, resizer2].forEach(resizer => {
        if (resizer) {
            resizer.addEventListener('mousedown', onResizerMouseDown);
        }
    });

    FORM_INPUT_IDS.forEach(id => {
        const element = document.getElementById(id);
        if (element && !id.endsWith('-csv-file')) { // Do not add input listeners to file inputs for caching
            element.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
                saveFormInput(target.id, target.value);
            });
        }
    });

    CSV_INPUT_CONFIG.forEach(config => {
        if (config.input) {
            config.input.addEventListener('change', (event) => {
                handleFileUpload(event, config.type, config.display);
            });
        }
    });
    
    // Feedback Modal Listeners
    if (feedbackModalCloseButton) feedbackModalCloseButton.addEventListener('click', closeFeedbackModal);
    if (feedbackForm) feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    // Close modal on escape key
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && feedbackModal && feedbackModal.style.display === 'block') {
            closeFeedbackModal();
        }
    });
    // Close modal on outside click
     if (feedbackModal) {
        feedbackModal.addEventListener('click', (event) => {
            if (event.target === feedbackModal) {
                closeFeedbackModal();
            }
        });
    }

    // Export Button Listeners
    document.querySelectorAll('.export-text-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const targetId = (event.currentTarget as HTMLButtonElement).dataset.target;
            const title = document.getElementById(`${targetId?.replace('-content', '-heading') || ''}`)?.textContent || 'Export';
            if (targetId) exportColumnAsText(targetId, title);
        });
    });
    document.querySelectorAll('.print-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const targetId = (event.currentTarget as HTMLButtonElement).dataset.target;
            const title = document.getElementById(`${targetId?.replace('-content', '-heading') || ''}`)?.textContent || 'Print View';
            if (targetId) printColumnContent(targetId, title);
        });
    });


    if (adsForm && analyzeButton) {
        adsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!ai) {
                displayUserMessage('error', "AI SDK not initialized. Cannot analyze.");
                return;
            }

            if (mainLoadingIndicator) mainLoadingIndicator.style.display = 'flex';
            if (analyzeButton) analyzeButton.disabled = true;
            if (errorMessageElement) errorMessageElement.style.display = 'none';
            // DO NOT clear currentRecommendations here, as we need it for feedback on the next run.
            // It will be cleared/replaced after a successful recommendation generation.
            allGroundingSources = [];


            currentCampaignDataSnapshot = {
                websiteUrl: websiteUrlInput?.value.trim() || '',
                aiFocusInstructions: aiFocusInstructionsInput?.value.trim() || '',
                // The following are just for summary in the prompt; actual content is passed separately.
                campaignPerformanceCsv: uploadedCsvContents['campaignPerformanceCsv'] ? 'Provided' : 'Not provided',
                searchQueryReportCsv: uploadedCsvContents['searchQueryReportCsv'] ? 'Provided' : 'Not provided',
                adsScheduleLocationCsv: uploadedCsvContents['adsScheduleLocationCsv'] ? 'Provided' : 'Not provided',
                auctionInsightsCsv: uploadedCsvContents['auctionInsightsCsv'] ? 'Provided' : 'Not provided',
                locationPerformanceCsv: uploadedCsvContents['locationPerformanceCsv'] ? 'Provided' : 'Not provided',
                keywordPerformanceCsv: uploadedCsvContents['keywordPerformanceCsv'] ? 'Provided' : 'Not provided',
                adsCsv: uploadedCsvContents['adsCsv'] ? 'Provided' : 'Not provided',
                campaignSettingsCsv: uploadedCsvContents['campaignSettingsCsv'] ? 'Provided' : 'Not provided',
                adGroupSettingsCsv: uploadedCsvContents['adGroupSettingsCsv'] ? 'Provided' : 'Not provided',
                exclusionListsCsv: uploadedCsvContents['exclusionListsCsv'] ? 'Provided' : 'Not provided',
                conversionActionsCsv: uploadedCsvContents['conversionActionsCsv'] ? 'Provided' : 'Not provided',
                assetDetailsCsv: uploadedCsvContents['assetDetailsCsv'] ? 'Provided' : 'Not provided'
            };
            
            if (!websiteUrlInput?.value.trim()) {
                displayUserMessage('warning', "Website URL is now mandatory to provide more customized results and enable comprehensive industry benchmarking.");
                if (mainLoadingIndicator) mainLoadingIndicator.style.display = 'none';
                if (analyzeButton) analyzeButton.disabled = false;
                switchToFormView();
                websiteUrlInput?.focus();
                return;
            }

            const hasAnyCsvData = Object.values(uploadedCsvContents).some(content => content && content.trim() !== '');
            
            if (!hasAnyCsvData && !aiFocusInstructionsInput?.value.trim()) {
                 displayUserMessage('warning', "Please provide AI Focus Instructions or upload at least one relevant CSV file in addition to the Website URL.");
                if (mainLoadingIndicator) mainLoadingIndicator.style.display = 'none';
                if (analyzeButton) analyzeButton.disabled = false;
                return;
            }


            switchToDashboardView();
            populateInputSummary(); // Uses uploadedCsvContents directly for "Content Loaded" status

            // --- Step 1: Generate Campaign Analysis ---
            if (campaignAnalysisLoading) campaignAnalysisLoading.style.display = 'flex';
            if (campaignAnalysisColumnContent) campaignAnalysisColumnContent.innerHTML = '';
            if (campaignAnalysisSourcesDiv) campaignAnalysisSourcesDiv.style.display = 'none';
            let campaignAnalysisText = 'No analysis generated.';
            
            const analysisPrompt = `
You are a world-leading Google Ads strategist and data analyst, embodying the principles of Six Sigma for quality and precision. You are known for your ability to perform deep forensic analyses, exhibit foresight, and unearth meticulously validated, actionable insights that drive significant campaign improvements. Superficial or generic statements are unacceptable; every observation must be data-backed by the provided CSVs. DO NOT use conversational preambles or summaries like "Okay, proceeding with..." or "Total Impressions: ...". Get straight to the structured analysis as detailed below.

Your objective is to conduct a COMPREHENSIVE, INTEGRATED, and **ERROR-INTOLERANT** analysis of ALL provided CSV data. The Website URL (${websiteUrlInput?.value.trim()}) is critical for inferring industry, business type, and likely campaign goals. Use this context throughout your analysis.
Structure your output in clear, well-reasoned paragraphs or bullet points, following the specified section headings. Use Markdown for formatting. Your tone should be authoritative, insightful, and precise.

For every metric or piece of information you report on:
- If the data is present in the CSVs, you MUST extract and state the actual value.
- If a specific data point, an entire relevant CSV, or specific columns within a CSV are missing, you MUST EXPLICITLY state, for example, "Overall Impressions: Data not found in Campaign Performance CSV as it was not provided or lacks this metric." or "Budget Information: Not available as Campaign Settings CSV was not provided." or "Cannot determine Ad Rotation setting as this column is missing from Ad Group Settings CSV."
- ABSOLUTELY NO GENERIC PLACEHOLDERS like '[data point from CSV]' or '[Aggregated data]' in your narrative. Your output MUST be directly usable and factual based SOLELY on the provided CSVs and website context.
- Attempt EVERY numbered section below. If data for an entire section is missing (e.g., all relevant CSVs not provided), state that for the section (e.g., "10. Exclusion List Audit & Opportunities: Exclusion Lists CSV not provided, so a direct audit of existing exclusions cannot be performed. Based on SQR analysis...").

KEY AREAS FOR DEEP-DIVE ANALYSIS (Leverage ALL relevant CSV data for each, aiming for expert-level depth):

1.  **Overall Campaign Health, KPI Assessment, & Future Projections (Derived from CSVs):**
    *   **Current Performance Evaluation:** Extract current core performance metrics (Impressions, Clicks, CTR, Avg. CPC, Conversions, Cost/Conversion, ROAS, etc.) directly from the **Campaign Performance CSV**, **Keyword Performance CSV**, and **Ads Performance & Creative Details CSV**. Aggregate data as needed to represent the overall current state. Identify the most recent time period available in these CSVs as the 'current period'.
    *   **Benchmarking Strategy (Apply in order of priority, with meticulous source citation):**
        *   **A. Internal CSV Comparison:** If the provided CSVs contain data over distinct time periods (e.g., date columns), identify a recent period as 'current' and an earlier period as 'comparison' for trend analysis. Clearly state the periods being compared. If date columns are absent, state this.
        *   **B. Industry Benchmarking (Leverage Website URL: ${websiteUrlInput?.value.trim()}):** If internal CSV comparison is not possible or insufficient, infer industry and business model from the website. Use Google Search to find RECENT, REPUTABLE industry average benchmarks (CTR, Avg. CPC, Conversion Rate, Cost/Conversion). YOU MUST CITE THE EXACT SOURCE URL AND THE DATE/YEAR. If no reliable benchmarks found, state "No reliable, recent industry benchmarks found via Google Search for [inferred industry]."
        *   **C. General Best Practices/Internal Consistency (If A and B are not applicable/fruitful):** State limitations. Assess based on best practices.
    *   **Budget & Pacing Analysis (Leverage 'Campaign Performance CSV' or 'Campaign Settings CSV'):** Extract budget information (Budget Amount, Budget Spent, Campaign Duration/Days Remaining if inferable from date ranges or explicit columns). Analyze pacing.
    *   **Foresight - Budget Projection:** Based on spending rate and any inferred 'Days Remaining' or campaign end dates from CSVs, project budget exhaustion or underspend. Quantify.
    *   **Foresight - Performance Projection & Risk/Opportunity Identification:** Project end-of-cycle outcomes based on trends observed in CSV data. Identify risks/opportunities.
    *   **Goal Alignment (Leverage Website URL: ${websiteUrlInput?.value.trim()}, 'Campaign Settings CSV'):** Infer/confirm primary campaign goals (e.g., from Campaign Settings CSV if 'Campaign Goal Type' is present, or infer from website). How well do current metrics AND projections (derived from CSVs) align?

2.  **Campaign & Ad Group Performance Deep Dive (using 'Campaign Performance CSV', 'Ad Group Settings CSV'):**
    *   Identify top/bottom performing campaigns/ad groups based on KPIs relevant to inferred goals, using data from 'Campaign Performance CSV'. Quantify.
    *   Analyze Ad Group Settings from 'Ad Group Settings CSV' (e.g., Default Bid, Ad Rotation, specific targeting for Display/Video like Keywords, Audiences, Topics, Placements) in conjunction with performance. State if 'Ad Group Settings CSV' is not provided.

3.  **Search Query & Keyword Relevance Analysis (Critical: Cross-reference 'Search Query Report CSV', 'Keyword Performance CSV'):**
    *   **SQR Analysis ('Search Query Report CSV'):** Relevant terms not targeted, irrelevant terms for negatives (quantify wasted spend), match type performance. State if 'Search Query Report CSV' is not provided.
    *   **Keyword Performance CSV Analysis:** Quality Score (Ad Relevance, Landing Page Exp., Exp. CTR), high impressions/low CTR or high spend/low conversions. Impression Share for top keywords. Final URL relevance. State if 'Keyword Performance CSV' is not provided.

4.  **Ad Performance, Creative & Asset Analysis (using 'Ads Performance & Creative Details CSV' and 'Individual Asset Details CSV'):**
    *   **Ad-Level Performance (from 'Ads Performance & Creative Details CSV'):** Top/bottom performers, characteristics of successful ads. State if 'Ads Performance & Creative Details CSV' is not provided.
    *   **Ad Copy Components (from 'Ads Performance & Creative Details CSV'):** Headlines, Descriptions, Paths for alignment with keywords (from Keyword CSV), SQR terms, user intent, clarity, value prop, CTAs. Ad Strength for RSAs if present.
    *   **Overall Asset Usage (from 'Ads Performance & Creative Details CSV'):** Identify which types of assets (Sitelinks, Callouts, Images, etc.) are generally used or missing across campaigns/ad groups.
    *   **Individual Asset Performance (from 'Individual Asset Details CSV'):** If provided, this is crucial. Analyze the performance of specific asset variations (e.g., Sitelink A vs. Sitelink B, specific image asset CTRs). Identify high/low performing individual assets. Cross-reference with overall Ad performance. State if 'Individual Asset Details CSV' is not provided.

5.  **Audience & Demographic Performance Analysis (using 'Segment Performance CSV', cross-reference with 'Ad Group Settings CSV' for configured audiences):**
    *   **Demographics (Age, Gender, Household Income):** Performance variations, bid modifier effectiveness if data present in 'Segment Performance CSV'.
    *   **Audiences (Affinity, In-Market, Custom, Remarketing):** Performance, Targeting vs. Observation settings, bid modifier effectiveness if data present. What audiences are configured in 'Ad Group Settings CSV' vs. what's performing in 'Segment Performance CSV'?
    *   **General Considerations:** Based on website/industry, what audiences are typically crucial? Note missing data but potential strategies. State if 'Segment Performance CSV' or 'Ad Group Settings CSV' not provided.

6.  **Device, Network, & Placement Performance (using 'Segment Performance CSV'):**
    *   **Devices:** Computers, Mobile Phones, Tablets. Performance, bid modifier effectiveness if present.
    *   **Networks (Search, Search Partners, Display):** Performance differences, potentially from 'Campaign Settings CSV' if network selection is detailed.
    *   **Placements (Display/Video):** Top/bottom performers. (Acknowledge if data insufficient in 'Segment Performance CSV'). State if 'Segment Performance CSV' not provided.

7.  **Competitive Landscape (using 'Auction Insights CSV'):**
    *   Main competitors, compare Impression Share, Overlap Rate, etc. Note competitors outranking on important terms. State if 'Auction Insights CSV' is not provided.

8.  **Geographic Performance (using 'Detailed Location Performance CSV', 'Campaign Settings CSV' for explicit targets):**
    *   Top/bottom performing locations. Bid modifier effectiveness. Compare explicit targets from 'Campaign Settings CSV' with performance. State if 'Detailed Location Performance CSV' or 'Campaign Settings CSV' not provided.

9.  **Ad Scheduling Performance (using 'Segment Performance CSV', 'Campaign Settings CSV' for configured schedule):**
    *   Performance by day/hour. Bid modifier effectiveness. Compare configured schedule from 'Campaign Settings CSV' with performance. State if 'Segment Performance CSV' or 'Campaign Settings CSV' not provided.

10. **Exclusion List Audit & Opportunities (using 'Exclusion Lists CSV', SQR, Location, Segment data):**
    *   Review existing Negative Keywords, Placement Exclusions, IP Exclusions from 'Exclusion Lists CSV'.
    *   Based on SQR ('Search Query Report CSV'), Location ('Detailed Location Performance CSV'), Segment ('Segment Performance CSV') data, identify additional needs for exclusions (keywords, locations, demographics, placements). State if 'Exclusion Lists CSV' not provided for direct audit.

11. **Conversion Tracking & Attribution Analysis (using 'Conversion Action Settings CSV'):**
    *   **Configuration Review:** Analyze Conversion Action Name, Source, Category, Count, Conversion Window, "Include in Conversions" status (Primary/Secondary), Value tracking method, Attribution Model from 'Conversion Action Settings CSV'.
    *   **Impact Assessment:** How do these settings affect reported performance and optimization decisions? Are there potential issues?
    *   **Data Consistency:** Do conversion numbers in performance CSVs align with what might be expected given these settings? State if 'Conversion Action Settings CSV' not provided.

12. **Synthesize & Diagnose (The "Alchemist's Insight"):**
    *   Connect dots with precision, referencing specific data from multiple CSVs (including Campaign Settings, Ad Group Settings, Conversion Actions, Individual Asset Details) to explain *why* performance is as it is.
    *   Formulate hypotheses about primary drivers of poor performance or key levers for growth, backed by specific data from CSVs.

USER'S SPECIAL FOCUS/INSTRUCTIONS:
${aiFocusInstructionsInput?.value.trim() || 'None provided. Adhere to the Six Sigma standard: Focus on general best practices, highest impact opportunities, and meticulous, data-driven analysis across all areas. Ensure all variable Google Ads parameters are considered, utilizing all provided CSV data. Extract all necessary metrics, budget details, and comparison points from the CSVs. If data is missing for any point, explicitly state this in your analysis.'}

DATA PROVIDED FOR ANALYSIS (Summary - full content passed separately in subsequent parts of this request):
- Website URL: ${currentCampaignDataSnapshot.websiteUrl} (Mandatory for context)
- AI Focus Instructions: ${currentCampaignDataSnapshot.aiFocusInstructions || 'None provided.'}
- CSVs:
  - Campaign Performance: ${currentCampaignDataSnapshot.campaignPerformanceCsv}
  - Search Query Report: ${currentCampaignDataSnapshot.searchQueryReportCsv}
  - Segment Performance (Time/Demo/Device/Audience/Network): ${currentCampaignDataSnapshot.adsScheduleLocationCsv}
  - Auction Insights: ${currentCampaignDataSnapshot.auctionInsightsCsv}
  - Detailed Location Performance: ${currentCampaignDataSnapshot.locationPerformanceCsv}
  - Keyword Performance: ${currentCampaignDataSnapshot.keywordPerformanceCsv}
  - Ads Performance & Creative Details: ${currentCampaignDataSnapshot.adsCsv}
  - Campaign Settings: ${currentCampaignDataSnapshot.campaignSettingsCsv}
  - Ad Group Settings: ${currentCampaignDataSnapshot.adGroupSettingsCsv}
  - Exclusion Lists: ${currentCampaignDataSnapshot.exclusionListsCsv}
  - Conversion Action Settings: ${currentCampaignDataSnapshot.conversionActionsCsv}
  - Individual Asset Details: ${currentCampaignDataSnapshot.assetDetailsCsv}
---
Provide a clear, well-structured, and deeply insightful analysis. Your goal is to uncover the 'why' behind the numbers with meticulous detail, project future possibilities based on evidence from CSVs, and set the stage for impactful recommendations. Do not make recommendations yet, only provide the analysis. Address any specific user instructions if provided, maintaining the highest standard of analytical rigor by deriving all necessary performance and budget data from the provided CSVs. ABSOLUTELY NO GENERIC PLACEHOLDERS like '[data point from CSV]' in your narrative. If data is missing for a point, EXPLICITLY state 'Data not found for [specific metric] in [specific CSV name]' or 'Cannot determine [specific insight] as [specific CSV name] was not provided or lacks relevant columns.' Your output MUST be directly usable and factual based SOLELY on the provided CSVs and website context. Ensure every numbered section above is addressed; if data is insufficient for a section, explicitly state the limitation for that section.
`;
            
                const analysisPromptParts: { text: string }[] = [{ text: analysisPrompt }];
                CSV_INPUT_CONFIG.forEach(config => {
                    if (uploadedCsvContents[config.type] && uploadedCsvContents[config.type].trim() !== '') {
                        analysisPromptParts.push({
                            text: `\n\n--- START OF ${config.name} DATA ---\n${uploadedCsvContents[config.type]}\n--- END OF ${config.name} DATA ---`
                        });
                    }
                });

            try {
                const analysisGenAIConfig: GenerateContentParameters['config'] = {};
                // Google Search is always enabled as Website URL is mandatory.
                analysisGenAIConfig.tools = [{googleSearch: {}}];
                
                const analysisRequest: GenerateContentParameters = {
                    model: "gemini-2.5-flash", 
                    contents: { parts: analysisPromptParts },
                    config: analysisGenAIConfig
                };
                const analysisResponse: GenerateContentResponse = await ai.models.generateContent(analysisRequest);
                campaignAnalysisText = analysisResponse.text;
                
                displayCampaignAnalysis(campaignAnalysisText, campaignAnalysisColumnContent);

                const groundingMetadata = analysisResponse.candidates?.[0]?.groundingMetadata;
                if (groundingMetadata?.groundingChunks && groundingMetadata.groundingChunks.length > 0) {
                    displayGroundingSources(groundingMetadata.groundingChunks, campaignAnalysisSourcesDiv, allGroundingSources);
                }

            } catch (error) {
                console.error("Error generating campaign analysis:", error);
                const errorMsg = error instanceof Error ? error.message : String(error);
                if (campaignAnalysisColumnContent) campaignAnalysisColumnContent.innerHTML = `<p class="error-message-style">Error generating analysis: ${escapeHtml(errorMsg)}</p>`;
                campaignAnalysisText = `Error: Failed to generate analysis. ${errorMsg}`;
            } finally {
                if (campaignAnalysisLoading) campaignAnalysisLoading.style.display = 'none';
            }

            // --- Step 2: Generate Actionable Recommendations ---
            if (recommendationsLoading) recommendationsLoading.style.display = 'flex';
            if (recommendationsColumnContent) recommendationsColumnContent.innerHTML = ''; 
            if (recommendationsSourcesDiv) recommendationsSourcesDiv.style.display = 'none'; 
            
            // Create a JSON string of feedback for the prompt
            const feedbackForPrompt = currentRecommendations
                .filter(rec => rec.feedbackLogged && (rec.feedbackText || rec.feedbackRating))
                .map(rec => ({
                    title: rec.title,
                    rationale: rec.rationale,
                    actionDetails: rec.actionDetails,
                    feedbackText: rec.feedbackText,
                    feedbackRating: rec.feedbackRating
                }));

            const feedbackJsonString = feedbackForPrompt.length > 0 ? JSON.stringify(feedbackForPrompt, null, 2) : '// No feedback logged yet in this session.';

            const recommendationsPrompt = `
You are a **world-class Google Ads strategist and AI agent, operating at a Six Sigma level of quality and precision.** You are tasked with delivering the **BEST POSSIBLE, METICULOUSLY DETAILED, AND ERROR-FREE OUTCOMES** for this campaign.
Based on the **ENTIRETY of the original campaign data (all CSV inputs, including Campaign Settings, Ad Group Settings, Exclusion Lists, Conversion Action Settings CSVs, and Individual Asset Details CSV, plus the mandatory Website URL: ${websiteUrlInput?.value.trim()})**, the **preceding comprehensive campaign analysis report (which includes foresight, projections, dynamic benchmarking, and consideration of all Google Ads variable parameters derived solely from all provided CSV data and the Website URL context)**, and **any user feedback on previous recommendations provided below**, your mission is to generate specific, high-impact, and actionable recommendations. Each recommendation should be so clear and detailed that it serves as a direct blueprint for manual implementation in a Google Ads account.
You MUST output your response as a **JSON array of recommendation objects**. Do NOT include any explanatory text or markdown before or after the JSON array.

PREVIOUS RECOMMENDATIONS & USER FEEDBACK LOGS:
---
${feedbackJsonString}
---
Analyze any feedback provided above to learn and adapt. If users mark a specific type of recommendation as 'ineffective', or if feedback highlights a recurring issue, you MUST adapt your future suggestions accordingly. This could involve refining the rationale for similar recommendations or suggesting alternative actions. Consider the 'feedbackLogged', 'feedbackText', and 'feedbackRating' fields to guide your next set of recommendations.

Each recommendation object in the array must strictly follow this structure:
{
  "id": "string (unique identifier, e.g., rec_001)",
  "category": "string (e.g., 'Keyword Optimization', 'Negative Keywords', 'Budget Allocation & Pacing', 'Bid Strategy Adjustment', 'Ad Copy Enhancement', 'Landing Page Optimization', 'Individual Asset Optimization', 'Targeting Refinement (Geo/Schedule)', 'Audience & Demographic Targeting', 'Device & Network Optimization', 'Exclusion Strategy', 'Campaign Structure', 'Campaign & Ad Group Settings', 'Conversion Tracking & Attribution', 'Competitive Strategy', 'Data Quality/Tracking', 'Forecasting & Risk Mitigation')",
  "priority": "string ('High', 'Medium', or 'Low' - based on potential impact and urgency, justified by data extracted from CSVs)",
  "title": "string (CONCISE, COMPELLING SUMMARY. MUST NOT contain generic placeholders like '[Data Point]'. Use actual examples derived from the CSVs or specific descriptions. E.g., 'Pause Low-Performing Sitelink Asset: "Old Sitelink Text" (from Individual Asset Details CSV)', 'Replace Underperforming Image Asset ID 123 (from Individual Asset Details CSV) with New Variant Focusing on X', 'Adjust Campaign Goal for "Awareness Campaign" (identified in Campaign Settings CSV) to "Brand Awareness".')",
  "rationale": "string (METICULOUS EXPLANATION of the 'WHY'. MUST NOT contain generic placeholders like '[Data Point]'. Explicitly reference specific data points, metrics, and trends extracted from specific CSVs (e.g., 'Individual Asset Details CSV shows Sitelink "Old Sitelink Text" has a 0.5% CTR and 0 conversions despite 500 impressions, while other sitelinks average 2% CTR.', 'Conversion Action Settings CSV indicates "View Content" is primary, potentially skewing CPA for sales-focused campaigns as seen in Campaign Performance CSV'), calculations from the analysis (e.g., projected budget shortfall of $X based on spend data in Campaign Performance CSV), and insights from multiple CSV sources. Articulate your confidence level. Explain the diagnosed problem this solves or the opportunity it captures. Crucially, you MUST explicitly state which CSV file(s) and/or website inferences were the primary drivers for this specific recommendation.)",
  "estimatedImpact": "string (QUANTIFIABLE potential positive outcome. MUST NOT contain generic placeholders like '[Data Point]'. E.g., 'Improve overall ad CTR by replacing underperforming asset, potentially increasing qualified clicks by X% (based on comparison with better performing assets in Individual Asset Details CSV)', 'Reduce wasted spend by $Y/month (calculated from specific irrelevant terms in SQR CSV) by refining primary conversion actions (based on Conversion Actions CSV)', 'Improve overall account CTR by 0.5% by adding relevant ad assets like sitelinks and callouts (suggested based on low current usage shown in Ads Performance & Creative Details CSV and industry best practices for the e-commerce site ${websiteUrlInput?.value.trim()}).')",
  "actionDetails": {
    "type": "string (e.g., 'ADD_KEYWORD', 'ADD_NEGATIVE_KEYWORD_LIST', 'ADJUST_BUDGET_CAMPAIGN', 'CHANGE_BID_STRATEGY_CAMPAIGN', 'CREATE_NEW_AD_VARIANT', 'OPTIMIZE_INDIVIDUAL_ASSET', 'REVIEW_LANDING_PAGE_FOR_KEYWORD', 'ADJUST_GEO_BID_MODIFIER', 'EXCLUDE_DEMOGRAPHIC_AGE_RANGE', 'ADD_AUDIENCE_TARGETING_OBSERVATION', 'CREATE_PLACEMENT_EXCLUSION_LIST', 'MONITOR_TREND_X', 'SETUP_CONVERSION_TRACKING', 'ADJUST_DEVICE_BID_MODIFIER', 'MODIFY_CAMPAIGN_SETTING', 'ADJUST_AD_GROUP_TARGETING', 'REFINE_EXCLUSION_LIST', 'OPTIMIZE_CONVERSION_ACTION_SETTINGS', 'PAUSE_INDIVIDUAL_ASSET', 'REPLACE_INDIVIDUAL_ASSET')",
    "parameters": {
        // ALL specific details for the action go here. This should be a COMPLETE BLUEPRINT.
        // MUST use ACTUAL EXAMPLES from CSVs. If listing all is impractical, list key examples and guide the user to find others based on specific criteria in the CSVs. DO NOT USE GENERIC PLACEHOLDERS like '[Keyword Y]'.
        // Example for Individual Asset: "assetType": "Sitelink", "assetIdentifier": "Old Sitelink Text", "actionToTake": "Pause", "reasoning": "Data from Individual Asset Details CSV shows CTR 0.5%, 0 conversions, 500 impressions."
        // Example for replacing asset: "assetType": "Image", "assetIdToReplace": "Specific Asset ID '12345'", "reasonForReplacement": "Low CTR (1%) and no conversions for this image asset.", "suggestedNewAssetDescription": "High-quality image showcasing product benefit X, with a clear call to action overlay if possible."
        // Example for ADD_KEYWORD: "keywordsToAdd": [{"keywordText": "actual keyword phrase", "matchType": "Phrase", "notes": "From SQR analysis, showed high CTR."}],
        // Example for including data source evidence: "csvSourceEvidence": ["Individual Asset Details CSV", "Campaign Performance CSV"]
    }
  }
}
// The 'actionDetails' object itself MUST ONLY contain 'type' and 'parameters' keys.

CRITICAL INSTRUCTIONS FOR RECOMMENDATIONS (Six Sigma Standard):
1.  **Meticulous Detail & Unambiguous Actions:** Each \`actionDetails.parameters\` MUST be a complete blueprint for manual action, using actual examples from CSVs.
2.  **Deep Synthesis & Explicit Source Attribution:** Recommendations MUST stem from a holistic understanding, connecting insights across ALL provided CSV data (including new Individual Asset Details CSV, Campaign Settings, Ad Group Settings, Exclusion Lists, Conversion Action Settings CSVs, Website URL context, and your prior analysis including projections and dynamic benchmarking derived from CSVs). Cite specific data sources, CSV file names, and metrics from these CSVs.
3.  **Justify Confidence ("How are you sure?"):** For strategic changes, explain how available data (from all CSV sources) supports the conclusion with high confidence.
4.  **Prioritize Impact:** Focus on recommendations delivering significant improvements or mitigating projected risks identified from CSV analysis. Quantify impact.
5.  **Comprehensive Coverage:** Address all relevant Google Ads levers: keywords, negatives, bidding, budget, ad copy, INDIVIDUAL assets (from 'Individual Asset Details CSV'), landing pages, targeting (geo, schedule, demographics, audiences, devices, networks), exclusions, campaign/ad group settings, conversion tracking, structure, and proactive measures based on forecasts derived from CSVs.
6.  **Precise Budget Optimization & Pacing:** Your budget recommendations MUST be highly specific. Cross-reference the 'Campaign Settings CSV' for total budget with the 'Campaign Performance CSV' for current spend and pacing. If performance data (e.g., CPA, ROAS) varies significantly across campaigns, YOU MUST recommend reallocating budget from underperforming campaigns to those showing better efficiency, citing specific figures from the CSVs. Also, analyze budget pacing versus campaign duration to forecast potential underspending or overspending.
7.  **Landing Page Analysis & Optimization:** Based on the 'Keyword Performance CSV' (specifically Quality Score components like 'Landing Page Experience') and the provided website URL, analyze potential landing page improvements. If the landing page experience score is low for certain keywords, recommend specific content, calls-to-action, or structural changes for the landing pages associated with those keywords. You may need to infer landing page URLs from the 'Ads Performance CSV' or assume they align with the main website URL.
8.  **Specific & Data-Driven Ad Copy Enhancement:** Analyze the 'Ads Performance & Creative Details CSV' and 'Keyword Performance CSV' to identify opportunities for improving ad copy. If keywords with high search volume and good Quality Scores have low CTRs, or if specific ad components (headlines, descriptions) are performing poorly, recommend specific replacement text for headlines and descriptions that better match high-performing keywords or search terms. Recommendations MUST include specific examples of text.
9.  **Competitor-Aware Bidding Strategy:** When analyzing the 'Auction Insights CSV', consider if competitor data suggests a need for aggressive bidding adjustments or defensive strategies. For example, if a competitor consistently has a higher 'Top of page rate' or 'Abs. Top of page rate', recommend adjusting bids or targeting for relevant keywords to compete more effectively. Tie this analysis to specific keywords or campaign goals where possible, referencing the 'Auction Insights CSV'.
10. **Address Data Directly:** If a CSV (e.g., 'Individual Asset Details CSV' showing poor asset performance, Campaign Settings CSV, Ad Group Settings CSV, Exclusion Lists CSV, Conversion Action Settings CSV) shows a clear misconfiguration or opportunity, recommend fixing it with specifics. If data for a granular area is missing from CSVs, recommend best practices or data collection for that area based on inferred campaign goals from ${websiteUrlInput?.value.trim()} and general Google Ads expertise.
11. **"Best Outcome" Thinking:** Provide expert-level, transformative advice.
12. **\`actionDetails\` Structure:** The \`actionDetails\` object MUST strictly contain only two keys: \`type\` (string) and \`parameters\` (object). All specific details for the action, including any \`csvSourceEvidence\` or descriptions of sub-steps, MUST be part of the \`parameters\` object.
13. **No Comments or Non-JSON Text in JSON:** The generated JSON array, and all its nested objects, arrays, keys, and string values, MUST NOT contain any comments (e.g., \`// ...\`) or any other non-JSON text. Generic placeholders are FORBIDDEN in the JSON output, use actual data or detailed descriptions.
14. **Valid JSON String Values:** All string values within the JSON output must be valid. This means any special characters within a string, such as double quotes (") or backslashes (\\), MUST be properly escaped. For fields like 'keywordText' or any descriptive text, ensure the content forms a valid JSON string. For example, a keyword "new ads" should be represented in JSON as "keywordText": "new ads", NOT as "keywordText": ""new ads"". If a keyword itself contains quotes, like 'keyword "example"', it should be represented as "keywordText": "keyword \\"example\\"".

USER'S SPECIAL FOCUS/INSTRUCTIONS (Address these where relevant in your recommendations, maintaining the highest quality standards):
${aiFocusInstructionsInput?.value.trim() || 'None provided. Adhere to the Six Sigma standard: Focus on general best practices, highest impact opportunities, and meticulous, data-driven analysis and recommendations across all areas. Ensure all variable Google Ads parameters are considered, fully utilizing all provided CSV data including the new configuration CSVs. All performance, budget, and comparison data must be derived from these CSVs. ABSOLUTELY NO GENERIC PLACEHOLDERS in any textual fields like title, rationale, estimatedImpact, or within the parameters object. Use actual data or specific descriptions.'}

ORIGINAL CAMPAIGN DATA (Summary - full content passed separately in subsequent parts of this request. Website URL is: ${websiteUrlInput?.value.trim()})
CSVs Available: Campaign Performance (${currentCampaignDataSnapshot.campaignPerformanceCsv}), SQR (${currentCampaignDataSnapshot.searchQueryReportCsv}), Segment Perf. (${currentCampaignDataSnapshot.adsScheduleLocationCsv}), Auction Insights (${currentCampaignDataSnapshot.auctionInsightsCsv}), Location Perf. (${currentCampaignDataSnapshot.locationPerformanceCsv}), Keyword Perf. (${currentCampaignDataSnapshot.keywordPerformanceCsv}), Ads Perf. & Creative (${currentCampaignDataSnapshot.adsCsv}), Campaign Settings (${currentCampaignDataSnapshot.campaignSettingsCsv}), Ad Group Settings (${currentCampaignDataSnapshot.adGroupSettingsCsv}), Exclusion Lists (${currentCampaignDataSnapshot.exclusionListsCsv}), Conversion Actions (${currentCampaignDataSnapshot.conversionActionsCsv}), Individual Asset Details (${currentCampaignDataSnapshot.assetDetailsCsv}).

CAMPAIGN ANALYSIS REPORT (Your previous output, derived solely from CSVs and Website URL context - also passed separately as a part of this request):
---
Generate 3-7 high-quality, deeply analytical, and actionable recommendations in the specified JSON format. Ensure each recommendation is unique, meticulously justified with explicit data source references (including from configuration and individual asset CSVs where applicable) and specific metrics extracted from these CSVs, and offers a clear, detailed blueprint for manual action. Adhere to the highest standards of accuracy and expert insight. All textual fields (title, rationale, estimatedImpact) and parameter values MUST use actual data/examples from CSVs or specific descriptions, NOT generic placeholders like '[Data Point]'. Ensure all JSON string values are correctly formatted and properly escape any internal special characters (like double quotes or backslashes).
`;
            
            const recommendationsPromptParts: { text: string }[] = [{ text: recommendationsPrompt }];
            CSV_INPUT_CONFIG.forEach(config => {
                if (uploadedCsvContents[config.type] && uploadedCsvContents[config.type].trim() !== '') {
                    recommendationsPromptParts.push({
                        text: `\n\n--- START OF ${config.name} DATA ---\n${uploadedCsvContents[config.type]}\n--- END OF ${config.name} DATA ---`
                    });
                }
            });
            recommendationsPromptParts.push({
                 text: `\n\n--- START OF PREVIOUS CAMPAIGN ANALYSIS REPORT ---\n${campaignAnalysisText}\n--- END OF PREVIOUS CAMPAIGN ANALYSIS REPORT ---`
            });

            try {
                if (!ai) {
                     displayUserMessage('error', "Critical Error: AI SDK became unavailable before generating recommendations.", false);
                     if (recommendationsLoading) recommendationsLoading.style.display = 'none';
                     return;
                }
                const recommendationsRequest: GenerateContentParameters = {
                    model: "gemini-2.5-flash",
                    contents: { parts: recommendationsPromptParts },
                    config: { responseMimeType: "application/json" } 
                };
                
                const recommendationsResponse: GenerateContentResponse = await ai.models.generateContent(recommendationsRequest);
                
                let parsedRecommendations: Recommendation[] = [];
                try {
                    let jsonStr = recommendationsResponse.text.trim();
                    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
                    const match = jsonStr.match(fenceRegex);
                    if (match && match[2]) {
                        jsonStr = match[2].trim();
                    }
                    parsedRecommendations = JSON.parse(jsonStr);
                } catch (parseError) {
                    console.error("Failed to parse JSON recommendations:", parseError, "\nRaw response text:", recommendationsResponse.text);
                    if (recommendationsColumnContent) recommendationsColumnContent.innerHTML = `<p class="error-message-style">Failed to parse AI recommendations: ${(parseError as Error).message}.</p><p>Raw output: <pre>${escapeHtml(recommendationsResponse.text)}</pre></p>`;
                    return;
                }

                currentRecommendations = parsedRecommendations.map((rec, index) => ({
                    ...rec,
                    id: `rec-${Date.now()}-${index}` // Ensure unique ID for this session
                }));


                if (currentRecommendations && currentRecommendations.length > 0) {
                    currentRecommendations.forEach((rec) => {
                        const card = createRecommendationCard(rec);
                        if(recommendationsColumnContent) recommendationsColumnContent.appendChild(card);
                    });
                } else {
                    if (recommendationsColumnContent) recommendationsColumnContent.innerHTML = '<p>No specific actionable recommendations found based on the analysis. You might want to provide more details or check back later.</p>';
                }
                
                const recGroundingMetadata = recommendationsResponse.candidates?.[0]?.groundingMetadata;
                if (recGroundingMetadata?.groundingChunks && recGroundingMetadata.groundingChunks.length > 0) {
                    displayGroundingSources(recGroundingMetadata.groundingChunks, recommendationsSourcesDiv, allGroundingSources);
                }

            } catch (error) {
                console.error("Error generating recommendations:", error);
                const errorMsg = error instanceof Error ? error.message : String(error);
                 if (recommendationsColumnContent) recommendationsColumnContent.innerHTML = `<p class="error-message-style">Error generating recommendations: ${escapeHtml(errorMsg)}</p>`;
            } finally {
                if (recommendationsLoading) recommendationsLoading.style.display = 'none';
                if (analyzeButton) analyzeButton.disabled = false;
            }
        });
    } else {
        console.error("Form or Analyze button not found. Event listener not attached.");
        displayUserMessage('error', "Fatal Error: Core form elements missing. Cannot attach functionality.");
        return false;
    }
    return true;
}

if (!initializeApp()) {
    console.warn("Application initialization failed. Some functionalities might be disabled or errors might be displayed.");
}
