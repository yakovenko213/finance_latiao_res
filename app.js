import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, setDoc, getDoc, writeBatch, getDocs, limit, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- CONFIG ---
const firebaseConfig = {
    apiKey: "AIzaSyDIk302oYXye-r4hRE-EB16N6K3T31g1uk",
    authDomain: "latiao-finance.firebaseapp.com",
    projectId: "latiao-finance",
    storageBucket: "latiao-finance.firebasestorage.app",
    messagingSenderId: "858773999156",
    appId: "1:858773999156:web:fe8f4907314f83c9a88461"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
try { setPersistence(auth, browserLocalPersistence).catch(console.error); } catch(e) {}

const { useState, useEffect, useMemo } = React;

// --- COMPONENTS ---
const Icon = ({ name, size = 18, className }) => {
    useEffect(() => { try { if(window.lucide) window.lucide.createIcons(); } catch(e){} }, [name]);
    return <i data-lucide={name} width={size} height={size} className={className}></i>;
};

const DEFAULT_CATEGORIES = {
    income: ['Продажі', 'Кешбек', 'Повернення', 'Інше'],
    expense: ['Закупівля (COGS)', 'Реклама', 'Логістика', 'Пакування', 'Зарплата', 'Податки', 'Оренда', 'Комісії', 'Знижки', 'Інше']
};

const ALL_VIEWS = [
    {id:'dashboard', label:'Огляд бізнесу', icon:'layout-grid'},
    {id:'ops', label:'Операції', icon:'list-checks'},
    {id:'pnl', label:'P&L Звіт', icon:'pie-chart'},
    {id:'cashflow', label:'Cash Flow', icon:'banknote'},
    {id:'dividends', label:'Дивіденди', icon:'gem'},
    {id:'managers', label:'Команда', icon:'users-round'},
    {id:'settings', label:'Налаштування', icon:'sliders-horizontal'}
];

// ... (Тут ідуть DashboardView, PnLView, CashFlowView, DividendsView, OpsView, ManagersView, SettingsView, TransactionModal з вашого оригінального коду) ...
// Для економії місця я пропускаю їх тут, але ви маєте вставити їх ПОВНІСТЮ з вашого коду.

// --- MAIN APP CONTROLLER (Приклад вставки) ---
const App = () => {
    // Весь код функції App з вашого файлу
    // ...
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
