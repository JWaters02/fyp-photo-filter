from firebase import *

def filter_images(uid: str, familyName: str):
    users = get_uids(familyName)
    if users is None: return None
    
    for uid in users:
        user = get_user_details(uid)
        if user is None: return None
        
        rules = get_user_rules(uid)
        if rules is None: return None

        download_images(uid)

        # process images
        
    
    return None