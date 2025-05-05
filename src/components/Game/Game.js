import { useParams } from "react-router-dom";

export default function Game() {

    const { difficulty } = useParams();
    return (
        <div>
            <p>Game Started at {difficulty}</p>
        </div>
    );
};