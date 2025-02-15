import io
import base64
import matplotlib.pyplot as plt

def save_plot(plt):
    # Save the plot to a bytes object
    img = io.BytesIO()
    plt.savefig(img, format='png', bbox_inches='tight')
    img.seek(0)

    # Encode the bytes object as a base64 string
    plot_url = base64.b64encode(img.getvalue()).decode()
    plt.close()

    return plot_url