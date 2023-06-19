from fastapi import APIRouter
from settings.config import *
import feedparser

router = APIRouter()

@router.get("/news")
def get_best_players():
    url = "https://feeds.bbci.co.uk/sport/formula1/rss.xml"

    feed = feedparser.parse(url)

    news_feed = []

    for entry in feed['entries'][:6]:
        news_feed.append({
            'articleTitle' :entry.title,
            'articleSummary' :entry.summary,
            'articleLink' :entry.link,
            'articlepublished' :entry.published  
        })
          
    return news_feed