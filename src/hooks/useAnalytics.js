import { db } from "../firebase";
import { 
  doc, 
  setDoc, 
  increment, 
  updateDoc, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";

// Simple flag to prevent multiple tracks in the same session/load
let isTracked = false;

const useAnalytics = () => {
  const trackVisit = async () => {
    if (isTracked) return;
    isTracked = true;

    const today = new Date().toISOString().split('T')[0];
    const statsRef = doc(db, "analytics", "overview");
    const dailyRef = doc(db, "analytics", `daily_${today}`);

    try {
      // 1. & 3. Total and Unique Visits (Consolidated)
      const visitorId = localStorage.getItem("visitorId");
      const lastVisitDay = localStorage.getItem("lastVisitDay");
      let isNewVisitor = false;
      let isTodayFirstSession = false;

      if (!visitorId) {
        const newVisitorId = crypto.randomUUID();
        localStorage.setItem("visitorId", newVisitorId);
        isNewVisitor = true;
      }

      if (lastVisitDay !== today) {
        localStorage.setItem("lastVisitDay", today);
        isTodayFirstSession = true;
      }

      await setDoc(statsRef, {
        total_visits: increment(1),
        unique_visitors: isNewVisitor ? increment(1) : increment(0)
      }, { merge: true });

      // 2. Today's Visits Increment (Total vs Unique Today)
      await setDoc(dailyRef, {
        visits: increment(1),
        unique_today: isTodayFirstSession ? increment(1) : increment(0),
        date: today
      }, { merge: true });
    } catch (error) {
      console.warn("Analytics tracking error:", error);
    }
  };

  const trackProjectView = async (projectTitle) => {
    try {
      const projectRef = doc(db, "analytics", "projects");
      await updateDoc(projectRef, {
        [projectTitle]: increment(1)
      }).catch(async () => {
        await setDoc(projectRef, { [projectTitle]: 1 }, { merge: true });
      });
    } catch (error) {
      console.warn("Project view tracking error:", error);
    }
  };

  const trackFormSubmission = async (formData) => {
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        status: "unread",
        timestamp: serverTimestamp()
      });
      
      const statsRef = doc(db, "analytics", "overview");
      await updateDoc(statsRef, {
        total_submissions: increment(1)
      }).catch(async () => {
        await setDoc(statsRef, { total_submissions: 1 }, { merge: true });
      });
    } catch (error) {
      console.error("Form track error:", error);
    }
  };

  return { trackVisit, trackProjectView, trackFormSubmission };
};

export default useAnalytics;
