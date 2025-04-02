export function ProgressIndicator({ currentIndex, total }) {
    return (
        <div style={styles.progressContainer}>
            {Array.from({ length: total }).map((_, i) => (
                <div 
                    key={i}
                    style={{
                        ...styles.progressStep,
                        backgroundColor: i <= currentIndex ? "#E5B688" : "#3a3a3a"
                    }}
                />
            ))}
        </div>
    );
}