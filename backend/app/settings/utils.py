def append_colors_to_labels(response_data):
    color_mapping = {
        'max_verstappen': '#0a208d',
        'perez': '#0a208d',
        'norris': '#FF8000',
        'piastri': '#FF8000',
        'leclerc': '#FF0000',
        'sainz': '#FF0000',
        'russell': '#0af1e6',
        'hamilton': '#0af1e6',
        'albon': '#2a98ed',
        'hulkenberg': '#9f9e9e',
        'alonso': '#066945',
        'stroll': '#066945',
        'ocon': '#2263e6',
        'tsunoda': '#334396',
        'gasly': '#2263e6',
    }

    labels = response_data['labels']
    background_colors = [color_mapping.get(label, '#000000') for label in labels]
    response_data['datasets'][0]['backgroundColor'] = background_colors

    return response_data
def append_colors_to_labels_constructor(response_data):
    color_mapping = {
        'red_bull': '#0a208d',
        'ferrari': '#FF8000',
        'ferrari': '#FF0000',
        'mercedes': '#0af1e6',
        'williams': '#2a98ed',
        'alfa': '#760909',
        'mclaren': '#FF8000',
        'haas': '#9f9e9e',
        'aston_martin': '#066945',
        'alphatauri': '#334396',
        'alpine': '#2263e6',
    }

    labels = response_data['labels']
    background_colors = [color_mapping.get(label, '#000000') for label in labels]
    response_data['datasets'][0]['backgroundColor'] = background_colors

    return response_data


def prepare_chart_data(data):
    labels = data['labels']
    datasets = data['datasets']
    color_mapping = {
        'ferrari': '#FF0000',
        'haas': '#FFFFFF',
        'alphatauri': '#0000FF',
        'williams': '#08298A',
        'alpine': '#0489B1',
        'alfa': '#8A0808',
        'mercedes': '#00FFFF',
        'mclaren': '#FF8000',
        'aston_martin': '#088A08',
        'red_bull': '#0080FF',
    }

    for dataset in datasets:
        label = dataset['label']
        if label in color_mapping:
            color = color_mapping[label]
            dataset['backgroundColor'] = color
            dataset['borderColor'] = color

    return data

def append_colors_to_bar_graph(response_data):
    color_mapping = {
        'max_verstappen': '#0a208d',
        'perez': '#0a208d',
        'norris': '#FF8000',
        'piastri': '#FF8000',
        'leclerc': '#FF0000',
        'sainz': '#FF0000',
        'russell': '#0af1e6',
        'hamilton': '#0af1e6',
        'albon': '#2a98ed',
        'sargeant': '#2a98ed',
        'hulkenberg': '#9f9e9e',
        'kevin_magnussen': '#9f9e9e',
        'alonso': '#066945',
        'stroll': '#066945',
        'ocon': '#2263e6',
        'tsunoda': '#334396',
        'ricciardo': '#334396',
        'de_vries': '#334396',
        'lawson': '#334396',
        'gasly': '#2263e6',
    }

    labels = response_data['labels']
    background_colors = [color_mapping.get(label, '#000000') for label in labels]

    datasets = response_data['datasets']
    for dataset in datasets:
        label = dataset['label']
        color = color_mapping.get(label, '#000000')
        dataset['borderColor'] = color
        dataset['backgroundColor'] = color

    response_data['datasets'] = datasets
    return response_data
def append_colors_to_bar_graph_constructors(response_data):
    color_mapping = {
        'ferrari': '#FF0000',
        'haas': '#FFFFFF',
        'alphatauri': '#08298A',
        'williams': '#0080FF',
        'alpine': '#0489B1',
        'alfa': '#8A0808',
        'mercedes': '#00FFFF',
        'mclaren': '#FF8000',
        'aston_martin': '#088A08',
        'red_bull': '#0000FF',
    }

    labels = response_data['labels']
    background_colors = [color_mapping.get(label, '#000000') for label in labels]

    datasets = response_data['datasets']
    for dataset in datasets:
        label = dataset['label']
        color = color_mapping.get(label, '#000000')
        dataset['borderColor'] = color
        dataset['backgroundColor'] = color

    response_data['datasets'] = datasets
    return response_data