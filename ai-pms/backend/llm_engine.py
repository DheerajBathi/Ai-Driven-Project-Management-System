import os
import json
from groq import Groq
from dtypes import TaskExtractionResponse
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq Client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = "Extract tasks/conflicts in JSON. Format: {tasks:[{task,assignee,deadline,priority:1-10}],conflicts:[{task,description}]}. Return ONLY JSON."

def analyze_transcript(text: str) -> dict:
    try:
        # Tighter truncation for 6k TPM limit (approx 4k-5k tokens)
        if len(text) > 10000:
            text = text[:10000] + "...[Truncated]"

        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": text}
            ],
            response_format={"type": "json_object"}
        )
        
        result_content = completion.choices[0].message.content
        data = json.loads(result_content)
        # Deep Hardening & Type Casting
        hardened_tasks = []
        for task in data.get("tasks", []):
            if not isinstance(task, dict): continue
            
            # Extract or fallback
            name = str(task.get("task", task.get("Task_Name", "Unknown Task")))
            assignee = str(task.get("assignee", task.get("Resources", "Unassigned")))
            deadline = str(task.get("deadline", task.get("Finish_Date", "Not specified")))
            
            # Priority Scaling/Capping
            try:
                p = int(task.get("priority", 5))
                priority = max(1, min(10, p if p <= 10 else 5))
            except:
                priority = 5
                
            hardened_tasks.append({
                "task": name,
                "assignee": assignee,
                "deadline": deadline,
                "priority": priority
            })

        hardened_conflicts = []
        for conflict in data.get("conflicts", []):
            if not isinstance(conflict, dict): continue
            hardened_conflicts.append({
                "task": str(conflict.get("task", "Logical Flag")),
                "description": str(conflict.get("description", "Potential contradiction detected."))
            })

        return {"tasks": hardened_tasks, "conflicts": hardened_conflicts}
    except Exception as e:
        error_msg = str(e)
        if "413" in error_msg or "rate_limit" in error_msg:
            return {
                "tasks": [], 
                "conflicts": [{
                    "task": "API Limit Reached", 
                    "description": "The file is too large for the free-tier API. Try uploading a smaller segment or a cleaned version."
                }]
            }
        print(f"Error calling Groq: {e}")
        return {"tasks": [], "conflicts": [{"task": "Error", "description": error_msg}]}
