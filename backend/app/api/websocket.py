from fastapi import WebSocket
import json
from ..services.mouse_control import MouseController

class WebSocketHandler:
    def __init__(self):
        self.mouse_controller = MouseController()

    async def handle_websocket(self, websocket: WebSocket):
        await websocket.accept()
        
        try:
            while True:
                data = await websocket.receive_text()
                movement_data = json.loads(data)
                
                if movement_data["mode"] == "cursor":
                    self.mouse_controller.move_cursor(
                        movement_data["dx"],
                        movement_data["dy"],
                        movement_data["sensitivity"]
                    )
                    
                elif movement_data["mode"] == "wheel":
                    self.mouse_controller.scroll(
                        movement_data["dy"],
                        movement_data["sensitivity"]
                    )
                    
        except Exception as e:
            print(f"Error in websocket handler: {e}")
        finally:
            await websocket.close() 