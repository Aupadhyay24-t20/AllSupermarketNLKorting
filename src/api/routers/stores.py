from fastapi import APIRouter
from ..database import supabase

router = APIRouter(prefix="/stores", tags=["stores"])

@router.get("/")
def get_stores():
    return supabase.table("stores").select("*").execute().data

