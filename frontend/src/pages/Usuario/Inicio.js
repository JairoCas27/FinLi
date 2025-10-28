//SECCION Ingresos


/* 2. Guardar ingreso (reemplaza tu addIncome() local) */


//SECCION Transacciones
// 🔁 Cargar transacciones desde el backend (sin tocar lógica local)
async function cargarTransaccionesDesdeBackend() {
    const usuario = JSON.parse(sessionStorage.getItem("loggedUser"));
    const email = usuario?.email || usuario?.correo;
    if (!email) {
        console.warn("⚠️ No hay usuario logueado. No se cargarán transacciones del backend.");
        return;
    }

    const inicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const fin = new Date().toISOString();

    try {
        const res = await fetch(`/api/transacciones?email=${email}&inicio=${inicio}&fin=${fin}`);
        if (!res.ok) throw new Error("Error al cargar transacciones");

        const data = await res.json();

        // ✅ Formatear al estilo local
        const formateadas = data.map(t => ({
            id: t.idTransaccion,
            type: t.tipo,
            amount: t.monto,
            description: t.descripcionTransaccion || t.nombreTransaccion,
            category: t.categoria?.nombreCategoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            subcategory: t.subcategoria?.nombreSubcategoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            paymentMethod: t.medioPago?.nombreMedioPago,
            paymentMethodId: t.medioPago?.idMedioPago,
            dateTime: t.fecha,
            formattedDate: formatDateTime(t.fecha),
            status: 'completado',
            image: t.imagen
        }));

        // ✅ Mezclar con locales sin duplicar
        const locales = JSON.parse(localStorage.getItem('finli-transactions') || '[]');
        const localesIds = new Set(locales.map(l => l.id));
        const nuevas = formateadas.filter(f => !localesIds.has(f.id));

        if (nuevas.length > 0) {
            const combinadas = [...nuevas, ...locales];
            localStorage.setItem('finli-transactions', JSON.stringify(combinadas));
            transactions = combinadas;
            renderTransactions();
            console.log(`✅ ${nuevas.length} transacciones nuevas desde backend.`);
        }

    } catch (error) {
        console.error("❌ Error al cargar transacciones desde backend:", error);
    }
}

// ✅ Integración al cargar la sección "inicio"
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(() => {
        const inicio = document.getElementById('inicio');
        if (inicio && inicio.classList.contains('active')) {
            cargarTransaccionesDesdeBackend();
            observer.disconnect(); // solo una vez
        }
    });

    observer.observe(document.body, {
        subtree: true,
        attributeFilter: ['class']
    });
});