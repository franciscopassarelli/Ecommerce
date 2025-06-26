// firebase/firestoreHelpers.js
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";

export const updateProductStock = async (slug, quantityPurchased) => {
  try {
    console.log("🛠️ Buscando producto con slug:", slug);
    
    // CAMBIÁ products → productos
    const q = query(collection(db, "productos"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const productDoc = querySnapshot.docs[0];
      const currentStock = productDoc.data().inStock;
      const newStock = currentStock - quantityPurchased;

      await updateDoc(productDoc.ref, { inStock: newStock });
      console.log(`✅ Stock actualizado para ${slug}: ${currentStock} → ${newStock}`);
    } else {
      console.error("❌ No se encontró ningún producto con ese slug:", slug);
    }
  } catch (error) {
    console.error("⚠️ Error al actualizar el stock:", error);
  }
};
