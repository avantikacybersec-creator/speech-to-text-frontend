import { useEffect, useState } from "react";

function UploadAudio() {

    const [file, setFile] = useState(null);
    const [transcript, setTranscript] = useState("");
    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {

        if (!file) {
            setError("Please select audio file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {

            setLoading(true);

            setError("");
            setMessage("");

            const response = await fetch(
                "https://speech-to-text-app-des3.onrender.com/api/speech/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.text();

            setTranscript(data);

            setMessage("Audio uploaded successfully!");

            fetchHistory();

        } catch (error) {

            console.error(error);

            setError("Upload failed");

        } finally {

            setLoading(false);

        }
    };
    const fetchHistory = async () => {

        try {

            const response = await fetch(
                "https://speech-to-text-app-des3.onrender.com/api/speech/history"
            );

            const data = await response.json();

            setHistory(data);

        } catch (error) {

            console.error(error);

        }
    };
    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div className="container">

            <h1>Speech To Text</h1>

            <input
                type="file"
                accept=".wav"
                onChange={handleFileChange}
            />

            <button onClick={handleUpload}>
                {loading ? "Uploading..." : "Upload Audio"}
            </button>

            {loading && <p>Uploading and processing audio...</p>}

            {message && <p>{message}</p>}

            {error && <p>{error}</p>}


            {transcript && (
                <div className="transcript-card">

                    <h3>Transcript</h3>

                    <p>{transcript}</p>

                </div>
            )}
            <div className="transcript-box">

                <h3>Previous Transcripts</h3>

                {
                    history.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                marginBottom: "20px",
                                padding: "15px",
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                border: "1px solid #ddd"
                            }}
                        >

                            <p>
                                <strong>File:</strong> {item.fileName}
                            </p>

                            <p>
                                <strong>Transcript:</strong>
                            </p>

                            <p>{item.transcript}</p>
                            <audio controls>
                                <source
                                    src={`http://localhost:8080/uploads/${item.fileName}`}
                                    type="audio/mpeg"
                                />
                            </audio>

                            <p>
                                <strong>Uploaded:</strong>{" "}
                                {new Date(item.uploadedAt)
                                    .toLocaleString()}
                            </p>

                        </div>
                    ))
                }

            </div>

        </div>
    );
}

export default UploadAudio;