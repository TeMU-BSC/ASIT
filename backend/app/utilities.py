from bson import ObjectId


def iso_format(_id: ObjectId) -> str:
    return _id.generation_time.strftime("%Y-%m-%dT%H:%M:%S")
