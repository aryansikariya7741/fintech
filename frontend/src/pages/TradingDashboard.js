import React, { useState, useEffect } from "react";
import { Container, Grid, Card, CardContent, Typography, Tabs, Tab, Button } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, collection } from "firebase/firestore";
import CryptoMarket from "./CryptoMarket";
import FixedDeposits from "./FixedDeposits";
import GoldInvestment from "./GoldInvestment";
import Analytics from "./Analytics";
import Stocks from "./Stocks";

const TradingDashboard = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [wallet, setWallet] = useState(10000); // Default ₹10,000
    const [portfolio, setPortfolio] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [priceHistory, setPriceHistory] = useState({});
    const [email, setEmail] = useState("");
    const [docId, setDocId] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                setEmail(user.email);
                const userCollectionRef = collection(db, "users", user.email, "sessions");
                const userDocRef = doc(userCollectionRef);
                setDocId(userDocRef.id);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setWallet(userData.wallet || 10000);
                    setPortfolio(userData.portfolio || {});
                    setTransactions(userData.transactions || []);
                    setPriceHistory(userData.priceHistory || {});
                    console.log("Fetched user data:", userData);
                } else {
                    // Create the document if it does not exist
                    await setDoc(userDocRef, {
                        wallet: 10000,
                        portfolio: {},
                        transactions: [],
                        priceHistory: {}
                    });
                    console.log("Created new user document");
                }
            } else {
                console.log("No user signed in");
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (email && docId) {
            updateDoc(doc(db, "users", email, "sessions", docId), { wallet })
                .then(() => console.log("Updated wallet:", wallet))
                .catch((error) => console.error("Error updating wallet:", error));
        }
    }, [wallet, email, docId]);

    useEffect(() => {
        if (email && docId) {
            updateDoc(doc(db, "users", email, "sessions", docId), { portfolio })
                .then(() => console.log("Updated portfolio:", portfolio))
                .catch((error) => console.error("Error updating portfolio:", error));
        }
    }, [portfolio, email, docId]);

    useEffect(() => {
        if (email && docId) {
            updateDoc(doc(db, "users", email, "sessions", docId), { transactions })
                .then(() => console.log("Updated transactions:", transactions))
                .catch((error) => console.error("Error updating transactions:", error));
        }
    }, [transactions, email, docId]);

    useEffect(() => {
        if (email && docId) {
            updateDoc(doc(db, "users", email, "sessions", docId), { priceHistory })
                .then(() => console.log("Updated price history:", priceHistory))
                .catch((error) => console.error("Error updating price history:", error));
        }
    }, [priceHistory, email, docId]);

    const handleSave = async () => {
        if (email && docId) {
            await setDoc(doc(db, "users", email, "sessions", docId), {
                wallet,
                portfolio,
                transactions,
                priceHistory
            });
            console.log("Saved data to Firestore:", { wallet, portfolio, transactions, priceHistory });
        }
    };

    const handleUpdate = async () => {
        if (email && docId) {
            await updateDoc(doc(db, "users", email, "sessions", docId), {
                wallet,
                portfolio,
                transactions,
                priceHistory
            });
            console.log("Updated data in Firestore:", { wallet, portfolio, transactions, priceHistory });
        }
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: "20px" }}>
            <Grid container spacing={3}>
                
                {/* Welcome Message */}
                <Grid item xs={12}>
                    <Typography variant="h4" style={{ color: "red", marginBottom: "20px" }}>
                        Welcome, {email}!
                    </Typography>
                </Grid>

                {/* Wallet & Portfolio Summary */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: "#121212", color: "#fff" }}>
                        <CardContent>
                            <Typography variant="h5">
                                <AccountBalanceIcon /> Wallet Balance: ₹{wallet.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Portfolio Section */}
                    <Card sx={{ bgcolor: "#1E1E1E", color: "#fff", marginTop: 2 }}>
                        <CardContent>
                            <Typography variant="h5"><ShoppingCartIcon /> Portfolio</Typography>
                            {Object.keys(portfolio).length > 0 ? (
                                <ul>
                                    {Object.entries(portfolio).map(([stock, details]) => (
                                        <li key={stock}>{stock}: {details.quantity} shares</li>
                                    ))}
                                </ul>
                            ) : (
                                <Typography>No stocks owned</Typography>
                            )}
                        </CardContent>
                    </Card>

                    {/* Transaction History */}
                    <Card sx={{ bgcolor: "#232323", color: "#fff", marginTop: 2 }}>
                        <CardContent>
                            <Typography variant="h5"><ReceiptIcon /> Transaction History</Typography>
                            {transactions.length > 0 ? (
                                <ul>
                                    {transactions.map((tx, index) => (
                                        <li key={index}>
                                            <Typography variant="body2" sx={{ color: tx.type === "BUY" ? "green" : "red" }}>
                                                {tx.type} {tx.stock} @ ₹{tx.price} ({tx.time})
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <Typography>No transactions yet</Typography>
                            )}
                        </CardContent>
                    </Card>

                    {/* Save and Update Buttons */}
                    <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: "10px" }}>
                        Save
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleUpdate} style={{ marginTop: "10px", marginLeft: "10px" }}>
                        Update
                    </Button>
                </Grid>

                {/* Market Tabs */}
                <Grid item xs={12} md={8}>
                    <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} textColor="primary">
                        <Tab label="Stocks" />
                        <Tab label="Cryptocurrency" />
                        <Tab label="Fixed Deposits" />
                        <Tab label="Gold" />
                        <Tab label="Analytics" />
                    </Tabs>

                    {/* Render Different Components Based on Tab Selection */}
                    {tabIndex === 0 && (
                        <Stocks 
                            wallet={wallet} 
                            setWallet={setWallet} 
                            portfolio={portfolio} 
                            setPortfolio={setPortfolio}
                            transactions={transactions}
                            setTransactions={setTransactions}
                        />
                    )}
                    {tabIndex === 1 && <CryptoMarket />}
                    {tabIndex === 2 && <FixedDeposits wallet={wallet} setWallet={setWallet} />}
                    {tabIndex === 3 && <GoldInvestment />}
                    {tabIndex === 4 && (
                        <Analytics 
                        portfolio={portfolio || {}} 
                        priceHistory={priceHistory || {}} 
                        fixedDeposits={JSON.parse(localStorage.getItem("fixedDeposits")) || []}
                        goldInvestments={JSON.parse(localStorage.getItem("goldInvestments")) || []}
                        cryptoInvestments={JSON.parse(localStorage.getItem("cryptoInvestments")) || []}
                        />
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default TradingDashboard;