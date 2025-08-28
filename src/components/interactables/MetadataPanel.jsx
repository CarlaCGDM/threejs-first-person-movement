import { IconButton } from "../UI/IconButton";
import { useTranslations } from '../../hooks/useTranslations';

export function MetadataPanel({
  title,
  subtitle,
  metadata,
  showMetadata,
  onToggleMetadata,
  customFields = null
}) {

  const { getComponentLabels } = useTranslations();
  const UILabels = getComponentLabels('metadataPanel'); // Retrieve metadataPanel labels

  // Define all possible fields with their display labels
  const fieldDefinitions = {
    historicalPeriod: UILabels.historicalPeriod,
    excavationSite: UILabels.excavationSite,
    currentLocation: UILabels.currentLocation,
    description: UILabels.description,
    size: UILabels.size,
    digitizedBy: UILabels.digitizedBy,
  };

  // Use custom fields if provided, otherwise use all available fields from metadata
  const fieldsToRender = customFields
    ? customFields
    : Object.keys(fieldDefinitions).filter(field => metadata[field]);

  return (
    <>
      {showMetadata && (
        <div style={styles.metadataContainer}>
          <div style={styles.metadataPanel}>
            <h2 style={styles.name}>{title}</h2>
            {subtitle && <h3 style={styles.subtitle}><i>{subtitle}</i></h3>}
            <div style={styles.metadataList}>
              {fieldsToRender.map(field => (
                <div key={field} style={styles.metadataItem}>
                  <h3 style={styles.label}>{fieldDefinitions[field]}</h3>
                  <p style={styles.value} dangerouslySetInnerHTML={{
                    __html: metadata[field].replace(/\r?\n/g, '<br /><br />')
                  }}></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  metadataContainer: {
    flex: 1,
    minWidth: "300px",
    marginTop: "20px",
    marginLeft: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  metadataPanel: {
    height: "90%",
    overflowY: "scroll",
    padding: "0.5vw 1vw",
    borderRadius: "0.25vw",
    paddingBottom: "20px",
    scrollbarWidth: "thin",
    scrollbarColor: "gray transparent",
    "&::WebkitScrollbar": {
      width: "6px",
    },
    "&::WebkitScrollbarTrack": {
      background: "transparent",
    },
    "&::WebkitScrollbarThumb": {
      backgroundColor: "gray",
      borderRadius: "3px",
    },
  },
  metadataList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "2vh",
  },
  metadataItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  name: {
    color: "#272626",
    fontFamily: "Mulish, sans-serif",
    fontSize: "1.5rem",
    marginBottom: 0,
  },
  subtitle: {
    color: "#777676",
    fontFamily: "Mulish, sans-serif",
    fontSize: "1.1rem",
    fontWeight: "100",
    margin: 0,
  },
  label: {
    color: "#272626",
    margin: 0,
    fontFamily: "Mulish, sans-serif",
    fontSize: "0.9rem",
    letterSpacing: "0.5px",
  },
  value: {
    color: "#272626",
    margin: 0,
    fontFamily: "Mulish, sans-serif",
    fontSize: "0.9rem",
    lineHeight: "1.4",
  },
  buttonsRow: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    paddingTop: "20px",
    borderTop: "1px solid #3a3a3a",
  }
};