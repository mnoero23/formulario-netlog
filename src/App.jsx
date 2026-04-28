import { useState } from "react";

// ⚠️ IMPORTANTE: Reemplazar esta URL con la URL de tu Google Apps Script
// (ver guía paso a paso para obtenerla)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby7GSJXi_HXGwaX6aWn1361ZBm-SbZ90xACquNWRuljUWtM5b5QNefwX3YWaIdwE1fr3g/exec";

const PRIMARY = "#005060";
const SECONDARY = "#007A6E";
const ACCENT = "#E6F2F0";
const BORDER = "#7DBDB5";
const LABEL = "#3D6B65";
const BG = "#F7FAFA";

function Field({ label, value, onChange, type = "text", required, half, options, placeholder }) {
  const base = {
    width: "100%", padding: "10px 12px", border: `1.5px solid ${BORDER}`,
    borderRadius: 6, fontSize: 14, fontFamily: "'Nunito Sans', sans-serif",
    color: PRIMARY, background: "white", outline: "none", transition: "border-color 0.2s",
    boxSizing: "border-box",
  };
  return (
    <div style={{ flex: half ? "1 1 48%" : "1 1 100%", minWidth: half ? 200 : "auto", marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: LABEL, marginBottom: 4, letterSpacing: 0.3 }}>
        {label} {required && <span style={{ color: "#c0392b" }}>*</span>}
      </label>
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={{ ...base, cursor: "pointer" }}>
          <option value="">Seleccionar...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
          placeholder={placeholder} style={{ ...base, resize: "vertical" }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} style={base}
          onFocus={e => e.target.style.borderColor = SECONDARY}
          onBlur={e => e.target.style.borderColor = BORDER} />
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        borderBottom: `2.5px solid ${SECONDARY}`, paddingBottom: 6, marginBottom: 16,
        display: "flex", alignItems: "center", gap: 8
      }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: PRIMARY, letterSpacing: 0.5, fontFamily: "'Nunito Sans', sans-serif" }}>
          {title}
        </h3>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px" }}>
        {children}
      </div>
    </div>
  );
}

function AddressBlock({ addr, idx, onChange, onRemove, total }) {
  const tipoOptions = ["Domicilio Legal (DNI)", "Domicilio Real (Residencia actual)", "Domicilio Laboral (Home Office)", "Otro"];
  const fullAddr = `${addr.calle} ${addr.nro}, ${addr.barrio}, ${addr.localidad} ${addr.provincia}, Argentina`;
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(fullAddr)}`;

  return (
    <div style={{
      background: "white", border: `1.5px solid ${BORDER}`, borderRadius: 10,
      padding: 18, marginBottom: 14, position: "relative"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: SECONDARY, fontFamily: "'Nunito Sans', sans-serif" }}>
          Domicilio {idx + 1}
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {addr.calle && addr.nro && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{
              fontSize: 12, color: SECONDARY, textDecoration: "none", display: "flex", alignItems: "center", gap: 3
            }}>
              📍 Ver en Maps
            </a>
          )}
          {total > 1 && (
            <button onClick={onRemove} style={{
              background: "none", border: "none", cursor: "pointer", color: "#c0392b", fontSize: 18, fontWeight: 700, lineHeight: 1
            }}>×</button>
          )}
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px" }}>
        <Field label="Tipo de domicilio" value={addr.tipo} onChange={v => onChange("tipo", v)} options={tipoOptions} half required />
        <Field label="Calle" value={addr.calle} onChange={v => onChange("calle", v)} half required />
        <Field label="N°" value={addr.nro} onChange={v => onChange("nro", v)} half required />
        <Field label="Piso" value={addr.piso} onChange={v => onChange("piso", v)} half />
        <Field label="Dpto" value={addr.dpto} onChange={v => onChange("dpto", v)} half />
        <Field label="Barrio" value={addr.barrio} onChange={v => onChange("barrio", v)} half />
        <Field label="C.P." value={addr.cp} onChange={v => onChange("cp", v)} half required />
        <Field label="Localidad" value={addr.localidad} onChange={v => onChange("localidad", v)} half />
        <Field label="Provincia" value={addr.provincia} onChange={v => onChange("provincia", v)} half />
      </div>
    </div>
  );
}

function WorkBlock({ work, idx, onChange, onRemove, total }) {
  return (
    <div style={{
      background: "white", border: `1.5px solid ${BORDER}`, borderRadius: 10,
      padding: 18, marginBottom: 14, position: "relative"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: SECONDARY, fontFamily: "'Nunito Sans', sans-serif" }}>
          Empleo anterior {idx + 1}
        </span>
        {total > 1 && (
          <button onClick={onRemove} style={{
            background: "none", border: "none", cursor: "pointer", color: "#c0392b", fontSize: 18, fontWeight: 700, lineHeight: 1
          }}>×</button>
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px" }}>
        <Field label="Empresa" value={work.empresa} onChange={v => onChange("empresa", v)} half />
        <Field label="Tareas desarrolladas" value={work.tareas} onChange={v => onChange("tareas", v)} half />
        <Field label="Desde" value={work.desde} onChange={v => onChange("desde", v)} type="date" half />
        <Field label="Hasta" value={work.hasta} onChange={v => onChange("hasta", v)} type="date" half />
        <Field label="Motivo de desvinculación" value={work.motivo} onChange={v => onChange("motivo", v)} />
      </div>
    </div>
  );
}

function AddButton({ onClick, label }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
      background: ACCENT, border: `1.5px dashed ${SECONDARY}`, borderRadius: 8,
      color: SECONDARY, fontSize: 13, fontWeight: 700, cursor: "pointer",
      fontFamily: "'Nunito Sans', sans-serif", transition: "all 0.2s", marginBottom: 16
    }}
      onMouseEnter={e => { e.target.style.background = SECONDARY; e.target.style.color = "white"; }}
      onMouseLeave={e => { e.target.style.background = ACCENT; e.target.style.color = SECONDARY; }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> {label}
    </button>
  );
}

function TabButton({ active, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "10px 20px", border: "none", borderBottom: active ? `3px solid ${SECONDARY}` : "3px solid transparent",
      background: active ? "white" : "transparent", color: active ? PRIMARY : "#888",
      fontWeight: active ? 800 : 600, fontSize: 13, cursor: "pointer",
      fontFamily: "'Nunito Sans', sans-serif", transition: "all 0.2s", letterSpacing: 0.3
    }}>
      {label}
    </button>
  );
}

const ciudadesPorProvincia = {
  "Buenos Aires": ["La Plata", "Mar del Plata", "Bahía Blanca", "Tandil", "Quilmes", "Lanús", "Lomas de Zamora", "Avellaneda", "San Isidro", "Tigre", "Pilar", "Morón", "Merlo", "Moreno", "San Martín", "Tres de Febrero", "Vicente López", "San Fernando", "Zárate", "Campana", "Luján", "Junín", "Pergamino", "Olavarría", "Necochea", "Otra"],
  "CABA": ["CABA"],
  "Catamarca": ["San Fernando del Valle de Catamarca", "Otra"],
  "Chaco": ["Resistencia", "Presidencia Roque Sáenz Peña", "Otra"],
  "Chubut": ["Rawson", "Comodoro Rivadavia", "Trelew", "Puerto Madryn", "Esquel", "Otra"],
  "Córdoba": ["Córdoba", "Villa Carlos Paz", "Río Cuarto", "Villa María", "San Francisco", "Alta Gracia", "Jesús María", "Bell Ville", "Río Tercero", "Villa Allende", "La Calera", "Cosquín", "Carlos Paz", "Unquillo", "Otra"],
  "Corrientes": ["Corrientes", "Goya", "Otra"],
  "Entre Ríos": ["Paraná", "Concordia", "Gualeguaychú", "Otra"],
  "Formosa": ["Formosa", "Clorinda", "Otra"],
  "Jujuy": ["San Salvador de Jujuy", "Palpalá", "Otra"],
  "La Pampa": ["Santa Rosa", "General Pico", "Otra"],
  "La Rioja": ["La Rioja", "Chilecito", "Otra"],
  "Mendoza": ["Mendoza", "San Rafael", "Godoy Cruz", "Las Heras", "Luján de Cuyo", "Maipú", "Otra"],
  "Misiones": ["Posadas", "Oberá", "Eldorado", "Otra"],
  "Neuquén": ["Neuquén", "San Martín de los Andes", "Zapala", "Otra"],
  "Río Negro": ["Viedma", "San Carlos de Bariloche", "General Roca", "Cipolletti", "Otra"],
  "Salta": ["Salta", "San Ramón de la Nueva Orán", "Tartagal", "Otra"],
  "San Juan": ["San Juan", "Rawson", "Otra"],
  "San Luis": ["San Luis", "Villa Mercedes", "Merlo", "Otra"],
  "Santa Cruz": ["Río Gallegos", "Caleta Olivia", "Otra"],
  "Santa Fe": ["Santa Fe", "Rosario", "Rafaela", "Venado Tuerto", "Reconquista", "Otra"],
  "Santiago del Estero": ["Santiago del Estero", "La Banda", "Otra"],
  "Tierra del Fuego": ["Ushuaia", "Río Grande", "Otra"],
  "Tucumán": ["San Miguel de Tucumán", "Yerba Buena", "Tafí Viejo", "Otra"],
};

function FileUpload({ label, fileState, onFileChange }) {
  const inputStyle = {
    display: "none",
  };
  const fileName = fileState ? fileState.name : null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", width: "100%" }}>
      <label style={{
        display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px",
        background: ACCENT, border: `1.5px solid ${BORDER}`, borderRadius: 6,
        color: SECONDARY, fontSize: 12, fontWeight: 700, cursor: "pointer",
        fontFamily: "'Nunito Sans', sans-serif", whiteSpace: "nowrap",
      }}>
        📎 Elegir archivo
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={inputStyle}
          onChange={e => { if (e.target.files[0]) onFileChange(e.target.files[0]); }} />
      </label>
      <span style={{ fontSize: 13, color: fileName ? PRIMARY : "#999", fontFamily: "'Nunito Sans', sans-serif" }}>
        {fileName || label}
      </span>
      {fileName && (
        <button onClick={() => onFileChange(null)} style={{
          background: "none", border: "none", color: "#c0392b", cursor: "pointer", fontSize: 14, fontWeight: 700
        }}>×</button>
      )}
    </div>
  );
}

const emptyAddr = () => ({ tipo: "", calle: "", nro: "", piso: "", dpto: "", barrio: "", cp: "", localidad: "", provincia: "" });
const emptyWork = () => ({ empresa: "", tareas: "", desde: "", hasta: "", motivo: "" });

export default function NetLogForm() {
  const [tab, setTab] = useState(0);
  const [personal, setPersonal] = useState({
    apellido: "", nombre: "", dni: "", cuil: "", fechaNac: "", nacionalidad: "Argentina",
    estadoCivil: "", ciudad: "", provincia: "", pais: "Argentina", telefono: "", email: "",
    conyugeNombre: "", conyugeTel: "", hijos: "", emergenciaTel: "", emergenciaVinculo: ""
  });
  const [addresses, setAddresses] = useState([emptyAddr()]);
  const [physical, setPhysical] = useState({
    estatura: "", peso: "", calzado: "", destreza: "", grupoSang: "", factorRH: "",
    alergias: "No", hipertension: "No", diabetes: "No", otraEnf: "", medicacion: "",
    tetanos: "No", tetanosVto: "", fiebreAm: "No", fiebreAmVto: "",
    obraSocial: "", servEmergencia: ""
  });
  const [general, setGeneral] = useState({
    hobby: "", deporte: "", federado: "No",
    carnetMunicipio: "", carnetPcia: "", carnetCat: "", carnetVto: "", carnetLimit: ""
  });
  const [laboral, setLaboral] = useState({
    tareas: "", primario: "", secundario: "", secTitulo: "", terciario: "", terTitulo: "",
    universitario: "", uniTitulo: "", observaciones: "", otroTrabajo: ""
  });
  const [works, setWorks] = useState([emptyWork()]);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const updatePersonal = (k, v) => setPersonal(p => ({ ...p, [k]: v }));
  const updatePhysical = (k, v) => setPhysical(p => ({ ...p, [k]: v }));
  const updateGeneral = (k, v) => setGeneral(p => ({ ...p, [k]: v }));
  const updateLaboral = (k, v) => setLaboral(p => ({ ...p, [k]: v }));

  const updateAddr = (i, k, v) => setAddresses(a => a.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const addAddr = () => setAddresses(a => [...a, emptyAddr()]);
  const removeAddr = (i) => setAddresses(a => a.filter((_, j) => j !== i));

  const updateWork = (i, k, v) => setWorks(w => w.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const addWork = () => setWorks(w => [...w, emptyWork()]);
  const removeWork = (i) => setWorks(w => w.filter((_, j) => j !== i));

  const tabs = ["Datos Personales", "Datos Físicos", "Datos Laborales"];

  const handleSubmit = async () => {
    if (!personal.apellido || !personal.dni || !personal.email || !personal.telefono) {
      setSendError("Por favor completá los campos obligatorios: Apellido y Nombre, DNI, Email y Teléfono.");
      setTimeout(() => setSendError(""), 5000);
      return;
    }

    setSending(true);
    setSendError("");

    const payload = { personal, addresses, physical, general, laboral, works };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch (err) {
      setSendError("Error al enviar. Verificá tu conexión e intentá de nuevo.");
    } finally {
      setSending(false);
    }
  };

  // Generar URL de la carpeta de Drive basada en el nombre
  const driveSearchUrl = `https://drive.google.com/drive/search?q=${encodeURIComponent((personal.apellido || "") + " - " + (personal.dni || ""))}`;

  if (submitted) {
    return (
      <div style={{ fontFamily: "'Nunito Sans', sans-serif", background: BG, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", padding: 40, maxWidth: 600 }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
          <h2 style={{ color: PRIMARY, margin: "0 0 8px" }}>Formulario enviado correctamente</h2>
          <p style={{ color: LABEL, fontSize: 14, marginBottom: 24 }}>Los datos han sido registrados. RRHH revisará la información.</p>
          
          <div style={{
            background: "white", borderRadius: 14, padding: "24px 28px", textAlign: "left",
            border: `2px solid ${SECONDARY}`, boxShadow: "0 4px 16px rgba(0,80,96,0.1)"
          }}>
            <h3 style={{ color: PRIMARY, fontSize: 16, margin: "0 0 12px", fontWeight: 800 }}>
              📁 Paso final: Subí tu documentación
            </h3>
            <p style={{ color: LABEL, fontSize: 13, lineHeight: 1.6, margin: "0 0 16px" }}>
              Se creó una carpeta personal en Google Drive con tu nombre. Hacé clic en el botón de abajo para abrirla y subí los siguientes documentos:
            </p>
            <div style={{ fontSize: 13, color: PRIMARY, lineHeight: 2.2, marginBottom: 16 }}>
              <div>☐ Foto 4x4</div>
              <div>☐ Copia de DNI (frente y dorso)</div>
              <div>☐ Copia de carnet de conducir</div>
              <div>☐ Carnet Unificado de Vacunación (CUV)</div>
              <div>☐ Copia de título</div>
              <div>☐ CV actualizado</div>
            </div>
            <a href={driveSearchUrl} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 28px", borderRadius: 10, background: SECONDARY, color: "white",
              fontWeight: 800, fontSize: 15, textDecoration: "none",
              fontFamily: "'Nunito Sans', sans-serif",
              boxShadow: "0 4px 12px rgba(0,122,110,0.3)"
            }}>
              📂 Abrir mi carpeta en Google Drive
            </a>
            <p style={{ color: "#999", fontSize: 11, marginTop: 12 }}>
              Formatos aceptados: PDF, JPG, PNG
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Nunito Sans', sans-serif", background: BG, minHeight: "100vh", padding: "20px 12px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          background: "white", borderRadius: 14, padding: "20px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 20, boxShadow: "0 2px 12px rgba(0,80,96,0.08)",
          borderTop: `4px solid ${SECONDARY}`, flexWrap: "wrap", gap: 12
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: PRIMARY, letterSpacing: 0.5 }}>
              DATOS PERSONALES Y ANTECEDENTES
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#888" }}>F-7.2.1-01 Q · Versión A · Net-Log Mud Logging Service</p>
          </div>
          <div style={{ fontSize: 11, color: "#999", textAlign: "right" }}>
            <div style={{ fontWeight: 700, color: SECONDARY }}>NET-LOG</div>
            <div>MUD LOGGING SERVICE</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          background: "white", borderRadius: "14px 14px 0 0", display: "flex",
          boxShadow: "0 2px 12px rgba(0,80,96,0.06)", overflow: "auto"
        }}>
          {tabs.map((t, i) => <TabButton key={i} active={tab === i} label={t} onClick={() => setTab(i)} />)}
        </div>

        {/* Content */}
        <div style={{
          background: "white", borderRadius: "0 0 14px 14px", padding: "24px 28px",
          boxShadow: "0 2px 12px rgba(0,80,96,0.06)", marginBottom: 20
        }}>
          {tab === 0 && (
            <>
              <Section title="DATOS PERSONALES">
                <Field label="Apellido y Nombre" value={personal.apellido} onChange={v => updatePersonal("apellido", v)} required />
                <Field label="DNI" value={personal.dni} onChange={v => updatePersonal("dni", v)} half required />
                <Field label="C.U.I.L." value={personal.cuil} onChange={v => updatePersonal("cuil", v)} half />
                <Field label="Fecha de Nacimiento" value={personal.fechaNac} onChange={v => updatePersonal("fechaNac", v)} type="date" half required />
                <Field label="Nacionalidad" value={personal.nacionalidad} onChange={v => updatePersonal("nacionalidad", v)} half />
                <Field label="Estado Civil" value={personal.estadoCivil} onChange={v => updatePersonal("estadoCivil", v)} half
                  options={["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a", "Unión convivencial"]} />
                <Field label="Provincia" value={personal.provincia} onChange={v => { updatePersonal("provincia", v); updatePersonal("ciudad", ""); }} half
                  options={["Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"]} />
                <Field label="Ciudad" value={personal.ciudad} onChange={v => updatePersonal("ciudad", v)} half
                  options={personal.provincia ? (ciudadesPorProvincia[personal.provincia] || []) : undefined} />
                <Field label="País" value={personal.pais} onChange={v => updatePersonal("pais", v)} half />
                <Field label="Teléfono" value={personal.telefono} onChange={v => updatePersonal("telefono", v)} half required />
                <Field label="E-mail personal" value={personal.email} onChange={v => updatePersonal("email", v)} type="email" required />
              </Section>
              <Section title="CONTACTO DE EMERGENCIA">
                <Field label="Nombre del Cónyuge" value={personal.conyugeNombre} onChange={v => updatePersonal("conyugeNombre", v)} half />
                <Field label="Teléfono Cónyuge" value={personal.conyugeTel} onChange={v => updatePersonal("conyugeTel", v)} half />
                <Field label="Cantidad de Hijos" value={personal.hijos} onChange={v => updatePersonal("hijos", v)} half />
                <Field label="Teléfono familiar cercano" value={personal.emergenciaTel} onChange={v => updatePersonal("emergenciaTel", v)} half required />
                <Field label="Vínculo" value={personal.emergenciaVinculo} onChange={v => updatePersonal("emergenciaVinculo", v)} half />
              </Section>
              <Section title="DOMICILIOS">
                {addresses.map((a, i) => (
                  <AddressBlock key={i} addr={a} idx={i} total={addresses.length}
                    onChange={(k, v) => updateAddr(i, k, v)} onRemove={() => removeAddr(i)} />
                ))}
                <AddButton onClick={addAddr} label="Agregar otro domicilio" />
                <div style={{ width: "100%", background: ACCENT, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: LABEL, lineHeight: 1.5, marginBottom: 8 }}>
                  💡 <strong>Importante para la ART:</strong> Declarar todos los domicilios desde los que se trabaja o se traslada al trabajo. La cobertura in itinere depende del domicilio declarado.
                </div>
              </Section>
            </>
          )}

          {tab === 1 && (
            <>
              <Section title="DATOS FÍSICOS">
                <Field label="Estatura (m)" value={physical.estatura} onChange={v => updatePhysical("estatura", v)} half placeholder="Ej: 1.83" />
                <Field label="Peso (kg)" value={physical.peso} onChange={v => updatePhysical("peso", v)} half />
                <Field label="Calzado N°" value={physical.calzado} onChange={v => updatePhysical("calzado", v)} half />
                <Field label="Destreza" value={physical.destreza} onChange={v => updatePhysical("destreza", v)} half options={["Diestro", "Zurdo", "Ambidiestro"]} />
                <Field label="Grupo Sanguíneo" value={physical.grupoSang} onChange={v => updatePhysical("grupoSang", v)} half
                  options={["A", "B", "AB", "O"]} />
                <Field label="Factor RH" value={physical.factorRH} onChange={v => updatePhysical("factorRH", v)} half options={["Positivo", "Negativo"]} />
              </Section>
              <Section title="SALUD">
                <Field label="Alergias" value={physical.alergias} onChange={v => updatePhysical("alergias", v)} half options={["Sí", "No"]} />
                <Field label="Hipertensión" value={physical.hipertension} onChange={v => updatePhysical("hipertension", v)} half options={["Sí", "No"]} />
                <Field label="Diabetes" value={physical.diabetes} onChange={v => updatePhysical("diabetes", v)} half options={["Sí", "No"]} />
                <Field label="Otra enfermedad (especificar)" value={physical.otraEnf} onChange={v => updatePhysical("otraEnf", v)} half />
                <Field label="Medicación habitual" value={physical.medicacion} onChange={v => updatePhysical("medicacion", v)} />
              </Section>
              <Section title="VACUNAS">
                <Field label="Tétanos" value={physical.tetanos} onChange={v => updatePhysical("tetanos", v)} half options={["Sí", "No"]} />
                <Field label="Vencimiento Tétanos" value={physical.tetanosVto} onChange={v => updatePhysical("tetanosVto", v)} type="date" half />
                <Field label="Fiebre Amarilla" value={physical.fiebreAm} onChange={v => updatePhysical("fiebreAm", v)} half options={["Sí", "No"]} />
                <Field label="Vencimiento Fiebre Amarilla" value={physical.fiebreAmVto} onChange={v => updatePhysical("fiebreAmVto", v)} type="date" half />
              </Section>
              <Section title="COBERTURA MÉDICA">
                <Field label="Obra Social o Mutual" value={physical.obraSocial} onChange={v => updatePhysical("obraSocial", v)} half />
                <Field label="Servicio de Emergencia" value={physical.servEmergencia} onChange={v => updatePhysical("servEmergencia", v)} half />
              </Section>
              <Section title="DATOS GENERALES">
                <Field label="Hobby / Pasatiempo" value={general.hobby} onChange={v => updateGeneral("hobby", v)} half />
                <Field label="Actividades Deportivas" value={general.deporte} onChange={v => updateGeneral("deporte", v)} half />
                <Field label="Federado" value={general.federado} onChange={v => updateGeneral("federado", v)} half options={["Sí", "No"]} />
              </Section>
              <Section title="CARNET DE CONDUCIR">
                <Field label="Municipio" value={general.carnetMunicipio} onChange={v => updateGeneral("carnetMunicipio", v)} half />
                <Field label="Provincia" value={general.carnetPcia} onChange={v => updateGeneral("carnetPcia", v)} half />
                <Field label="Categoría" value={general.carnetCat} onChange={v => updateGeneral("carnetCat", v)} half
                  options={["A1", "A2", "A3", "B1", "B2", "C1", "C2", "C3", "D1", "D2", "D3", "D4", "E1", "E2", "E3"]} />
                <Field label="Vencimiento" value={general.carnetVto} onChange={v => updateGeneral("carnetVto", v)} type="date" half />
                <Field label="Limitaciones" value={general.carnetLimit} onChange={v => updateGeneral("carnetLimit", v)} />
              </Section>
            </>
          )}

          {tab === 2 && (
            <>
              <Section title="DATOS LABORALES">
                <Field label="Tareas a desarrollar" value={laboral.tareas} onChange={v => updateLaboral("tareas", v)} />
              </Section>
              <Section title="NIVEL DE ESTUDIOS">
                <Field label="Primario" value={laboral.primario} onChange={v => updateLaboral("primario", v)} half options={["Completo", "Incompleto"]} />
                <Field label="Secundario" value={laboral.secundario} onChange={v => updateLaboral("secundario", v)} half options={["Completo", "Incompleto"]} />
                <Field label="Título Secundario" value={laboral.secTitulo} onChange={v => updateLaboral("secTitulo", v)} half />
                <Field label="Terciario" value={laboral.terciario} onChange={v => updateLaboral("terciario", v)} half options={["Completo", "Incompleto", "No aplica"]} />
                <Field label="Título Terciario" value={laboral.terTitulo} onChange={v => updateLaboral("terTitulo", v)} half />
                <Field label="Universitario" value={laboral.universitario} onChange={v => updateLaboral("universitario", v)} half options={["Completo", "Incompleto", "No aplica"]} />
                <Field label="Título Universitario" value={laboral.uniTitulo} onChange={v => updateLaboral("uniTitulo", v)} half />
                <Field label="Observaciones" value={laboral.observaciones} onChange={v => updateLaboral("observaciones", v)} type="textarea" />
              </Section>
              <Section title="ANTECEDENTES LABORALES">
                {works.map((w, i) => (
                  <WorkBlock key={i} work={w} idx={i} total={works.length}
                    onChange={(k, v) => updateWork(i, k, v)} onRemove={() => removeWork(i)} />
                ))}
                <AddButton onClick={addWork} label="Agregar otro empleo anterior" />
                <Field label="¿Posee otro trabajo o actividad comercial actualmente?" value={laboral.otroTrabajo} onChange={v => updateLaboral("otroTrabajo", v)} />
              </Section>
              <Section title="DOCUMENTACIÓN ADJUNTA">
                <div style={{ width: "100%", background: ACCENT, borderRadius: 10, padding: "16px 20px", lineHeight: 1.8 }}>
                  <p style={{ fontSize: 13, color: PRIMARY, fontWeight: 700, margin: "0 0 8px" }}>
                    📁 Al enviar el formulario se creará una carpeta en Google Drive con tu nombre donde deberás subir:
                  </p>
                  <div style={{ fontSize: 13, color: LABEL, paddingLeft: 8 }}>
                    <div>• Foto 4x4</div>
                    <div>• Copia de DNI (frente y dorso)</div>
                    <div>• Copia de carnet de conducir</div>
                    <div>• Carnet Unificado de Vacunación (CUV)</div>
                    <div>• Copia de título</div>
                    <div>• CV actualizado</div>
                  </div>
                  <p style={{ fontSize: 12, color: "#888", margin: "10px 0 0", fontStyle: "italic" }}>
                    Formatos aceptados: PDF, JPG, PNG. Después de enviar el formulario vas a ver el botón para abrir tu carpeta.
                  </p>
                </div>
              </Section>
              <div style={{
                background: ACCENT, borderRadius: 10, padding: "14px 18px",
                fontSize: 12, color: "#444", lineHeight: 1.6, fontStyle: "italic", marginBottom: 20
              }}>
                DECLARO BAJO JURAMENTO que los datos consignados en el presente formulario son correctos y completos,
                comprometiéndome a informar cualquier modificación que se produzca dentro de las 48 horas de ocurrida
                la novedad. El domicilio declarado será válido para todos los efectos legales.
              </div>
            </>
          )}
        </div>

        {/* Error message */}
        {sendError && (
          <div style={{
            background: "#FFF0F0", border: "1px solid #FFB0B0", borderRadius: 10,
            padding: "12px 18px", marginBottom: 12, color: "#CC0000", fontSize: 13,
            fontFamily: "'Nunito Sans', sans-serif"
          }}>
            ⚠️ {sendError}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          {tab > 0 && (
            <button onClick={() => setTab(tab - 1)} style={{
              padding: "12px 28px", borderRadius: 10, border: `2px solid ${SECONDARY}`,
              background: "white", color: SECONDARY, fontWeight: 700, fontSize: 14,
              cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif"
            }}>
              ← Anterior
            </button>
          )}
          <div style={{ flex: 1 }} />
          {tab < 2 ? (
            <button onClick={() => setTab(tab + 1)} style={{
              padding: "12px 28px", borderRadius: 10, border: "none",
              background: SECONDARY, color: "white", fontWeight: 700, fontSize: 14,
              cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif",
              boxShadow: "0 4px 12px rgba(0,122,110,0.25)"
            }}>
              Siguiente →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={sending} style={{
              padding: "12px 32px", borderRadius: 10, border: "none",
              background: sending ? "#888" : PRIMARY, color: "white", fontWeight: 800, fontSize: 14,
              cursor: sending ? "wait" : "pointer", fontFamily: "'Nunito Sans', sans-serif",
              boxShadow: "0 4px 12px rgba(0,80,96,0.3)", letterSpacing: 0.5,
              opacity: sending ? 0.7 : 1
            }}>
              {sending ? "⏳ Enviando..." : "✓ Enviar formulario"}
            </button>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 20 }}>
          Net-Log Mud Logging Service · F-7.2.1-01 Q · Versión A
        </p>
      </div>
    </div>
  );
}
