import { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "tr" | "es";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Common
    "common.close": "Close",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.create": "Create",
    "common.search": "Search",
    "common.loading": "Loading",
    "common.error": "Error",
    "common.success": "Success",

    // Header
    "header.projects": "Projects",
    "header.templates": "Templates",
    "header.preferences": "Preferences",

    // Dashboard
    "dashboard.structuredInput": "Structured Input",
    "dashboard.aiPrompt": "AI Prompt",
    "dashboard.generating": "AI is creating visualization...",
    "dashboard.ready": "Visualization ready",
    "dashboard.noVisualization": "No visualization generated",

    // Chart
    "chart.preview": "Chart Preview",
    "chart.export": "Export PNG",
    "chart.fullscreen": "Fullscreen",
    "chart.maximize": "Maximize",
    "chart.minimize": "Minimize",
    "chart.noChart": "No chart to display",
    "chart.generateChart": "Generate a chart to see the preview",
    "chart.renderingError": "Chart Rendering Error",
    "chart.retry": "Retry",
    "chart.rendering": "Rendering chart...",
    "chart.exportSuccess": "Chart exported as high-quality PNG",
    "chart.exportFailed": "Export Failed",
    "chart.noChartToExport": "No chart found to export",

    // Projects
    "projects.title": "Project Management",
    "projects.browse": "Browse Projects",
    "projects.createNew": "Create New",
    "projects.searchProjects": "Search projects...",
    "projects.noProjects": "No projects found",
    "projects.createFirst": "Create your first project to get started",
    "projects.projectName": "Project Name",
    "projects.enterName": "Enter project name...",
    "projects.description": "Description",
    "projects.describeProject": "Describe your project...",
    "projects.creating": "Creating...",
    "projects.createProject": "Create Project",
    "projects.openProject": "Open Project",
    "projects.nameRequired": "Name Required",
    "projects.enterProjectName": "Please enter a project name.",
    "projects.created": "Project Created",
    "projects.createdSuccess": "has been created successfully.",
    "projects.selected": "Project Selected",
    "projects.nowWorking": "Now working on",
    "projects.deleteConfirm": "Are you sure you want to delete",
    "projects.deleteWarning": "This action cannot be undone.",
    "projects.deleted": "Project Deleted",
    "projects.deletedSuccess": "Project has been deleted successfully.",
    "projects.deleteFailed": "Deletion Failed",
    "projects.failedToDelete": "Failed to delete project",
    "projects.tasks": "tasks",
    "projects.charts": "charts",
    "projects.active": "active",
    "projects.completed": "completed",
    "projects.archived": "archived",

    // Templates
    "templates.title": "Chart Templates",
    "templates.all": "All",
    "templates.development": "Development",
    "templates.projectManagement": "Project",
    "templates.planning": "Planning",
    "templates.uxui": "UX/UI",
    "templates.product": "Product",
    "templates.useTemplate": "Use Template",
    "templates.applied": "Template Applied",
    "templates.appliedSuccess": "template has been applied to your project.",
    "templates.schemaCopied": "Schema Copied",
    "templates.copiedToClipboard": "Template schema has been copied to clipboard.",

    // Preferences
    "preferences.title": "Preferences",
    "preferences.aiGeneration": "AI & Generation",
    "preferences.appearance": "Appearance",
    "preferences.editor": "Editor",
    "preferences.export": "Export",
    "preferences.defaultChartType": "Default Chart Type",
    "preferences.autoSelect": "Auto-select best type",
    "preferences.ganttChart": "Gantt Chart",
    "preferences.flowchart": "Flowchart",
    "preferences.mindMap": "Mind Map",
    "preferences.timeline": "Timeline",
    "preferences.stateDiagram": "State Diagram",
    "preferences.graph": "Graph",
    "preferences.autoSave": "Auto-save Projects",
    "preferences.autoSaveDesc": "Automatically save your work",
    "preferences.theme": "Theme",
    "preferences.light": "Light",
    "preferences.dark": "Dark",
    "preferences.system": "System",
    "preferences.chartSize": "Chart Size",
    "preferences.small": "Small",
    "preferences.medium": "Medium",
    "preferences.large": "Large",
    "preferences.fullWidth": "Full Width",
    "preferences.showGridLines": "Show Grid Lines",
    "preferences.gridLinesDesc": "Display grid lines in charts",
    "preferences.animations": "Animations",
    "preferences.animationsDesc": "Enable smooth animations",
    "preferences.showCodeEditor": "Show Code Editor",
    "preferences.codeEditorDesc": "Display code editor by default",
    "preferences.defaultExportFormat": "Default Export Format",
    "preferences.resetToDefault": "Reset to Default",
    "preferences.saveChanges": "Save Changes",
    "preferences.saved": "Preferences Saved",
    "preferences.savedSuccess": "Your preferences have been saved successfully.",
    "preferences.reset": "Preferences Reset",
    "preferences.resetSuccess": "All preferences have been reset to default values.",
    "preferences.language": "Language",
    "preferences.english": "English",
    "preferences.turkish": "Türkçe",
    "preferences.spanish": "Español"
  },
  tr: {
    // Common
    "common.close": "Kapat",
    "common.save": "Kaydet",
    "common.cancel": "İptal",
    "common.delete": "Sil",
    "common.edit": "Düzenle",
    "common.create": "Oluştur",
    "common.search": "Ara",
    "common.loading": "Yükleniyor",
    "common.error": "Hata",
    "common.success": "Başarılı",

    // Header
    "header.projects": "Projeler",
    "header.templates": "Şablonlar",
    "header.preferences": "Tercihler",

    // Dashboard
    "dashboard.structuredInput": "Yapılandırılmış Giriş",
    "dashboard.aiPrompt": "AI Komut",
    "dashboard.generating": "AI görselleştirme oluşturuyor...",
    "dashboard.ready": "Görselleştirme hazır",
    "dashboard.noVisualization": "Görselleştirme oluşturulmadı",

    // Chart
    "chart.preview": "Grafik Önizleme",
    "chart.export": "PNG Dışa Aktar",
    "chart.fullscreen": "Tam Ekran",
    "chart.maximize": "Büyüt",
    "chart.minimize": "Küçült",
    "chart.noChart": "Gösterilecek grafik yok",
    "chart.generateChart": "Önizlemeyi görmek için bir grafik oluşturun",
    "chart.renderingError": "Grafik Oluşturma Hatası",
    "chart.retry": "Tekrar Dene",
    "chart.rendering": "Grafik oluşturuluyor...",
    "chart.exportSuccess": "Grafik yüksek kaliteli PNG olarak dışa aktarıldı",
    "chart.exportFailed": "Dışa Aktarma Başarısız",
    "chart.noChartToExport": "Dışa aktarılacak grafik bulunamadı",

    // Projects
    "projects.title": "Proje Yönetimi",
    "projects.browse": "Projelere Gözat",
    "projects.createNew": "Yeni Oluştur",
    "projects.searchProjects": "Projelerde ara...",
    "projects.noProjects": "Proje bulunamadı",
    "projects.createFirst": "Başlamak için ilk projenizi oluşturun",
    "projects.projectName": "Proje Adı",
    "projects.enterName": "Proje adını girin...",
    "projects.description": "Açıklama",
    "projects.describeProject": "Projenizi açıklayın...",
    "projects.creating": "Oluşturuluyor...",
    "projects.createProject": "Proje Oluştur",
    "projects.openProject": "Projeyi Aç",
    "projects.nameRequired": "Ad Gerekli",
    "projects.enterProjectName": "Lütfen bir proje adı girin.",
    "projects.created": "Proje Oluşturuldu",
    "projects.createdSuccess": "başarıyla oluşturuldu.",
    "projects.selected": "Proje Seçildi",
    "projects.nowWorking": "Şimdi üzerinde çalışıyor",
    "projects.deleteConfirm": "Silmek istediğinizden emin misiniz",
    "projects.deleteWarning": "Bu işlem geri alınamaz.",
    "projects.deleted": "Proje Silindi",
    "projects.deletedSuccess": "Proje başarıyla silindi.",
    "projects.deleteFailed": "Silme Başarısız",
    "projects.failedToDelete": "Proje silinemedi",
    "projects.tasks": "görev",
    "projects.charts": "grafik",
    "projects.active": "aktif",
    "projects.completed": "tamamlandı",
    "projects.archived": "arşivlendi",

    // Templates
    "templates.title": "Grafik Şablonları",
    "templates.all": "Tümü",
    "templates.development": "Geliştirme",
    "templates.projectManagement": "Proje",
    "templates.planning": "Planlama",
    "templates.uxui": "UX/UI",
    "templates.product": "Ürün",
    "templates.useTemplate": "Şablonu Kullan",
    "templates.applied": "Şablon Uygulandı",
    "templates.appliedSuccess": "şablonu projenize uygulandı.",
    "templates.schemaCopied": "Şema Kopyalandı",
    "templates.copiedToClipboard": "Şablon şeması panoya kopyalandı.",

    // Preferences
    "preferences.title": "Tercihler",
    "preferences.aiGeneration": "AI ve Oluşturma",
    "preferences.appearance": "Görünüm",
    "preferences.editor": "Editör",
    "preferences.export": "Dışa Aktarma",
    "preferences.defaultChartType": "Varsayılan Grafik Türü",
    "preferences.autoSelect": "En iyi türü otomatik seç",
    "preferences.ganttChart": "Gantt Grafiği",
    "preferences.flowchart": "Akış Şeması",
    "preferences.mindMap": "Zihin Haritası",
    "preferences.timeline": "Zaman Çizelgesi",
    "preferences.stateDiagram": "Durum Diyagramı",
    "preferences.graph": "Grafik",
    "preferences.autoSave": "Projeleri Otomatik Kaydet",
    "preferences.autoSaveDesc": "Çalışmanızı otomatik olarak kaydedin",
    "preferences.theme": "Tema",
    "preferences.light": "Açık",
    "preferences.dark": "Koyu",
    "preferences.system": "Sistem",
    "preferences.chartSize": "Grafik Boyutu",
    "preferences.small": "Küçük",
    "preferences.medium": "Orta",
    "preferences.large": "Büyük",
    "preferences.fullWidth": "Tam Genişlik",
    "preferences.showGridLines": "Izgara Çizgilerini Göster",
    "preferences.gridLinesDesc": "Grafiklerde ızgara çizgilerini göster",
    "preferences.animations": "Animasyonlar",
    "preferences.animationsDesc": "Yumuşak animasyonları etkinleştir",
    "preferences.showCodeEditor": "Kod Editörünü Göster",
    "preferences.codeEditorDesc": "Kod editörünü varsayılan olarak göster",
    "preferences.defaultExportFormat": "Varsayılan Dışa Aktarma Formatı",
    "preferences.resetToDefault": "Varsayılanlara Sıfırla",
    "preferences.saveChanges": "Değişiklikleri Kaydet",
    "preferences.saved": "Tercihler Kaydedildi",
    "preferences.savedSuccess": "Tercihleriniz başarıyla kaydedildi.",
    "preferences.reset": "Tercihler Sıfırlandı",
    "preferences.resetSuccess": "Tüm tercihler varsayılan değerlere sıfırlandı.",
    "preferences.language": "Dil",
    "preferences.english": "English",
    "preferences.turkish": "Türkçe",
    "preferences.spanish": "Español"
  },
  es: {
    // Common
    "common.close": "Cerrar",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.create": "Crear",
    "common.search": "Buscar",
    "common.loading": "Cargando",
    "common.error": "Error",
    "common.success": "Éxito",

    // Header
    "header.projects": "Proyectos",
    "header.templates": "Plantillas",
    "header.preferences": "Preferencias",

    // Dashboard
    "dashboard.structuredInput": "Entrada Estructurada",
    "dashboard.aiPrompt": "Comando AI",
    "dashboard.generating": "AI está creando visualización...",
    "dashboard.ready": "Visualización lista",
    "dashboard.noVisualization": "No se generó visualización",

    // Chart
    "chart.preview": "Vista Previa del Gráfico",
    "chart.export": "Exportar PNG",
    "chart.fullscreen": "Pantalla Completa",
    "chart.maximize": "Maximizar",
    "chart.minimize": "Minimizar",
    "chart.noChart": "Sin gráfico para mostrar",
    "chart.generateChart": "Genere un gráfico para ver la vista previa",
    "chart.renderingError": "Error de Renderizado del Gráfico",
    "chart.retry": "Reintentar",
    "chart.rendering": "Renderizando gráfico...",
    "chart.exportSuccess": "Gráfico exportado como PNG de alta calidad",
    "chart.exportFailed": "Exportación Fallida",
    "chart.noChartToExport": "No se encontró gráfico para exportar",

    // Projects
    "projects.title": "Gestión de Proyectos",
    "projects.browse": "Explorar Proyectos",
    "projects.createNew": "Crear Nuevo",
    "projects.searchProjects": "Buscar proyectos...",
    "projects.noProjects": "No se encontraron proyectos",
    "projects.createFirst": "Crea tu primer proyecto para comenzar",
    "projects.projectName": "Nombre del Proyecto",
    "projects.enterName": "Ingrese el nombre del proyecto...",
    "projects.description": "Descripción",
    "projects.describeProject": "Describe tu proyecto...",
    "projects.creating": "Creando...",
    "projects.createProject": "Crear Proyecto",
    "projects.openProject": "Abrir Proyecto",
    "projects.nameRequired": "Nombre Requerido",
    "projects.enterProjectName": "Por favor ingrese un nombre de proyecto.",
    "projects.created": "Proyecto Creado",
    "projects.createdSuccess": "ha sido creado exitosamente.",
    "projects.selected": "Proyecto Seleccionado",
    "projects.nowWorking": "Ahora trabajando en",
    "projects.deleteConfirm": "¿Está seguro de que desea eliminar",
    "projects.deleteWarning": "Esta acción no se puede deshacer.",
    "projects.deleted": "Proyecto Eliminado",
    "projects.deletedSuccess": "El proyecto ha sido eliminado exitosamente.",
    "projects.deleteFailed": "Eliminación Fallida",
    "projects.failedToDelete": "No se pudo eliminar el proyecto",
    "projects.tasks": "tareas",
    "projects.charts": "gráficos",
    "projects.active": "activo",
    "projects.completed": "completado",
    "projects.archived": "archivado",

    // Templates
    "templates.title": "Plantillas de Gráficos",
    "templates.all": "Todos",
    "templates.development": "Desarrollo",
    "templates.projectManagement": "Proyecto",
    "templates.planning": "Planificación",
    "templates.uxui": "UX/UI",
    "templates.product": "Producto",
    "templates.useTemplate": "Usar Plantilla",
    "templates.applied": "Plantilla Aplicada",
    "templates.appliedSuccess": "plantilla ha sido aplicada a tu proyecto.",
    "templates.schemaCopied": "Esquema Copiado",
    "templates.copiedToClipboard": "El esquema de la plantilla ha sido copiado al portapapeles.",

    // Preferences
    "preferences.title": "Preferencias",
    "preferences.aiGeneration": "AI y Generación",
    "preferences.appearance": "Apariencia",
    "preferences.editor": "Editor",
    "preferences.export": "Exportar",
    "preferences.defaultChartType": "Tipo de Gráfico Predeterminado",
    "preferences.autoSelect": "Seleccionar automáticamente el mejor tipo",
    "preferences.ganttChart": "Gráfico Gantt",
    "preferences.flowchart": "Diagrama de Flujo",
    "preferences.mindMap": "Mapa Mental",
    "preferences.timeline": "Línea de Tiempo",
    "preferences.stateDiagram": "Diagrama de Estados",
    "preferences.graph": "Gráfico",
    "preferences.autoSave": "Guardar Proyectos Automáticamente",
    "preferences.autoSaveDesc": "Guarde su trabajo automáticamente",
    "preferences.theme": "Tema",
    "preferences.light": "Claro",
    "preferences.dark": "Oscuro",
    "preferences.system": "Sistema",
    "preferences.chartSize": "Tamaño del Gráfico",
    "preferences.small": "Pequeño",
    "preferences.medium": "Mediano",
    "preferences.large": "Grande",
    "preferences.fullWidth": "Ancho Completo",
    "preferences.showGridLines": "Mostrar Líneas de Cuadrícula",
    "preferences.gridLinesDesc": "Mostrar líneas de cuadrícula en gráficos",
    "preferences.animations": "Animaciones",
    "preferences.animationsDesc": "Habilitar animaciones suaves",
    "preferences.showCodeEditor": "Mostrar Editor de Código",
    "preferences.codeEditorDesc": "Mostrar editor de código por defecto",
    "preferences.defaultExportFormat": "Formato de Exportación Predeterminado",
    "preferences.resetToDefault": "Restablecer a Predeterminado",
    "preferences.saveChanges": "Guardar Cambios",
    "preferences.saved": "Preferencias Guardadas",
    "preferences.savedSuccess": "Sus preferencias han sido guardadas exitosamente.",
    "preferences.reset": "Preferencias Restablecidas",
    "preferences.resetSuccess": "Todas las preferencias han sido restablecidas a valores predeterminados.",
    "preferences.language": "Idioma",
    "preferences.english": "English",
    "preferences.turkish": "Türkçe",
    "preferences.spanish": "Español"
  }
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("novaflow-language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("novaflow-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}