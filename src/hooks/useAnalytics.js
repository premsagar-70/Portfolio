import { db } from "../firebase";
import { 
  doc, 
  setDoc, 
  increment, 
  updateDoc, 
  collection, 
  addDoc, 
  serverTimestamp,
  arrayUnion
} from "firebase/firestore";
import { UAParser } from "ua-parser-js";

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
        const generateId = () => (typeof crypto !== 'undefined' && crypto.randomUUID) 
          ? crypto.randomUUID() 
          : Math.random().toString(36).substring(2) + Date.now().toString(36);
        const newVisitorId = generateId();
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

      const parser = new UAParser();
      const result = parser.getResult();
      
      const browserInfo = result.browser.name 
        ? `${result.browser.name} ${result.browser.version?.split('.')[0] || ''}`.trim() 
        : "Unknown Browser";
      
      let deviceInfo = result.os.name || "Desktop";
      if (result.device.vendor && result.device.model) {
          deviceInfo = `${result.device.vendor} ${result.device.model}`;
      } else if (result.device.model) {
          deviceInfo = result.device.model;
      } else if (result.os.name) {
          deviceInfo = `${result.os.name} ${result.os.version || ''}`.trim();
      }

      // Attempt to get the precise device model using the modern Client Hints API (Chrome/Edge)
      if (typeof navigator !== 'undefined' && navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
          try {
              const uaData = await navigator.userAgentData.getHighEntropyValues(['model', 'platform']);
              if (uaData.model) {
                  deviceInfo = `${uaData.platform} ${uaData.model}`;
              }
          } catch (e) {
              // Ignore if browser blocks it
          }
      }

      // Fallbacks and cleanups for generic/frozen user agents
      if (deviceInfo === "Windows" || deviceInfo.startsWith("Windows 10")) {
          deviceInfo = "Windows PC";
      } else if (deviceInfo === "Mac OS") {
          deviceInfo = "Apple Mac";
      } else if (deviceInfo === "K" || deviceInfo.trim() === "") {
          // Modern Android Chrome/Edge freezes the UA model as "K" to protect privacy.
          deviceInfo = `${result.os.name || "Android"} Mobile`;
      }

      const visitDetails = {
        time: new Date().toISOString(),
        browser: browserInfo,
        device: deviceInfo,
        isNewVisitor: isNewVisitor
      };

      // 2. Today's Visits Increment (Total vs Unique Today)
      await setDoc(dailyRef, {
        visits: increment(1),
        unique_today: isTodayFirstSession ? increment(1) : increment(0),
        date: today,
        visitLogs: arrayUnion(visitDetails)
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
