import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, setDoc, getDoc, writeBatch, getDocs, limit, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- FIREBASE CONFIG ---
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
setPersistence(auth, browserLocalPersistence).catch(console.error);

const { useState, useEffect, useMemo } = React;

// Іконки Lucide
const Icon = ({ name, size = 18, className }) => {
    useEffect(() => { try { if(window.lucide) window.lucide.createIcons(); } catch(e){} }, [name]);
    return <i data-lucide={name} width={size} height={size} className={className}></i>;
};

const ALL_VIEWS = [
    {id:'dashboard', label:'Огляд бізнесу', icon:'layout-grid'},
    {id:'ops', label:'Операції', icon:'list-checks'},
    {id:'purchase', label:'Закупка', icon:'shopping-cart', soon: true},
    {id:'pnl', label:'P&L Звіт', icon:'pie-chart'},
    {id:'cashflow', label:'Cash Flow', icon:'banknote'},
    {id:'dividends', label:'Дивіденди', icon:'gem'},
    {id:'managers', label:'Команда', icon:'users-round'},
    {id:'settings', label:'Налаштування', icon:'sliders-horizontal'}
];

// --- КОМПОНЕНТ ДАШБОРДУ ---
const DashboardView = ({ metrics }) => (
    <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
                <div className="text-slate-400 text-xs font-bold uppercase mb-2">Гроші в касі</div>
                <div className="text-3xl font-mono">{metrics.totalCash.toLocaleString()} ₴</div>
            </div>
            <div className="card-modern p-6">
                <div className="text-slate-500 text-xs font-bold uppercase mb-2">Чистий прибуток</div>
                <div className="text-3xl font-mono text-emerald-600">{metrics.net.toLocaleString()} ₴</div>
            </div>
            <div className="card-modern p-6">
                <div className="text-slate-500 text-xs font-bold uppercase mb-2">Запас (Runway)</div>
                <div className="text-3xl font-mono text-brand-500">{metrics.runway} днів</div>
            </div>
        </div>
        <div className="p-10 text-center text-slate-400 border-2 border-dashed rounded-3xl">
            Графіки та детальна аналітика завантажуються...
        </div>
    </div>
);

// --- ГОЛОВНИЙ ДОДАТОК ---
const App = () => {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser(u);
                loadData();
            } else {
                setLoading(false);
            }
        });
        return () => unsub();
    }, []);

    const loadData = () => {
        onSnapshot(collection(db, "transactions"), (snap) => {
            setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
    };

    const metrics = useMemo(() => {
        const revenue = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0);
        const totalCash = revenue - expense;
        const runway = expense > 0 ? (totalCash / (expense / 30)).toFixed(0) : "∞";
        return { totalCash, net: revenue - expense, runway };
    }, [transactions]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (err) {
            alert("Помилка: " + err.message);
            setLoading(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center font-bold text-brand-500">ЗАВАНТАЖЕННЯ...</div>;

    if (!user) return (
        <div className="h-screen flex items-center justify-center bg-slate-900">
            <form onSubmit={handleLogin} className="card-modern p-8 w-80 space-y-4">
                <h1 className="text-xl font-bold text-center">Latiao Finance</h1>
                <input type="email" placeholder="Email" className="w-full p-3 border rounded-xl" onChange={e=>setEmail(e.target.value)} />
                <input type="password" placeholder="Пароль" className="w-full p-3 border rounded-xl" onChange={e=>setPass(e.target.value)} />
                <button className="w-full bg-brand-500 text-white p-3 rounded-xl font-bold">Увійти</button>
            </form>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            <aside className="w-64 bg-white border-r p-6 flex flex-col">
                <div className="text-2xl font-black text-brand-600 mb-10">LATIAO</div>
                <nav className="flex-1 space-y-2">
                    {ALL_VIEWS.map(v => (
                        <button key={v.id} onClick={() => !v.soon && setView(v.id)} 
                            className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-sm ${view === v.id ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-3">
                                <Icon name={v.icon} /> {v.label}
                            </div>
                            {v.soon && <span className="text-[10px] text-red-500">Скоро</span>}
                        </button>
                    ))}
                </nav>
                <button onClick={() => signOut(auth)} className="text-slate-400 text-sm font-bold mt-4 hover:text-red-500 transition">Вийти</button>
            </aside>
            <main className="flex-1 p-10 overflow-y-auto">
                <header className="mb-10">
                    <h2 className="text-4xl font-extrabold text-slate-900 capitalize">{view}</h2>
                    <p className="text-slate-500">{user.email}</p>
                </header>
                {view === 'dashboard' && <DashboardView metrics={metrics} />}
                {view !== 'dashboard' && <div className="card-modern p-20 text-center text-slate-400">Цей розділ ({view}) наповнюється даними...</div>}
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
