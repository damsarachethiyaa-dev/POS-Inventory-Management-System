package JIAT.Component;

import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Cursor;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.RenderingHints;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;
import javax.swing.JButton;
import javax.swing.border.EmptyBorder;
import org.jdesktop.animation.timing.Animator;
import org.jdesktop.animation.timing.TimingTarget;
import org.jdesktop.animation.timing.TimingTargetAdapter;

public class Button extends JButton {

    private Animator animator;
    private int targetSize;
    private float animatSize;
    private Point pressedPoint;
    private float alpha;

    private Color effectColor = new Color(255, 255, 255);
    private int cornerRadius = 20;
    private Color pressedBackground = new Color(220, 220, 220);
    private Color shadowColor = new Color(0, 0, 0, 30);
    private boolean shadowEnabled = true;

    public Button() {
        setContentAreaFilled(false);
        setBorder(new EmptyBorder(5, 0, 5, 0));
        setBackground(Color.WHITE);
        setCursor(new Cursor(Cursor.HAND_CURSOR));

        addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent me) {
                targetSize = Math.max(getWidth(), getHeight()) * 2;
                animatSize = 0;
                pressedPoint = me.getPoint();
                alpha = 0.5f;
                if (animator != null && animator.isRunning()) {
                    animator.stop();
                }
                if (animator != null) {
                    animator.start();
                }
            }
        });

        TimingTarget target = new TimingTargetAdapter() {
            @Override
            public void timingEvent(float fraction) {
                if (fraction > 0.5f) {
                    alpha = 1 - fraction;
                }
                animatSize = fraction * targetSize;
                repaint();
            }
        };

        animator = new Animator(700, target);
        animator.setAcceleration(0.5f);
        animator.setDeceleration(0.5f);
        animator.setResolution(0);
    }

    // Getters and setters
    public Color getEffectColor() {
        return effectColor;
    }

    public void setEffectColor(Color effectColor) {
        this.effectColor = effectColor;
    }

    public int getCornerRadius() {
        return cornerRadius;
    }

    public void setCornerRadius(int cornerRadius) {
        this.cornerRadius = cornerRadius;
        repaint();
    }

    public Color getPressedBackground() {
        return pressedBackground;
    }

    public void setPressedBackground(Color pressedBackground) {
        this.pressedBackground = pressedBackground;
    }

    public Color getShadowColor() {
        return shadowColor;
    }

    public void setShadowColor(Color shadowColor) {
        this.shadowColor = shadowColor;
        repaint();
    }

    public boolean isShadowEnabled() {
        return shadowEnabled;
    }

    public void setShadowEnabled(boolean shadowEnabled) {
        this.shadowEnabled = shadowEnabled;
        repaint();
    }

    @Override
    protected void paintComponent(Graphics grphcs) {
        int width = getWidth();
        int height = getHeight();

        BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = img.createGraphics();

        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Draw shadow if enabled
        if (shadowEnabled) {
            g2.setColor(shadowColor);
            g2.fillRoundRect(2, 2, width - 4, height - 4, cornerRadius, cornerRadius);
        }

        // Draw background with pressed effect
        if (getModel().isPressed()) {
            g2.setColor(pressedBackground);
        } else {
            g2.setColor(getBackground());
        }
        g2.fillRoundRect(0, 0, width, height, cornerRadius, cornerRadius);

        // Draw ripple effect on click
        if (pressedPoint != null) {
            g2.setColor(effectColor);
            g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_ATOP, alpha));
            g2.fillOval(
                (int) (pressedPoint.x - animatSize / 2),
                (int) (pressedPoint.y - animatSize / 2),
                (int) animatSize,
                (int) animatSize
            );
        }

        // Reset composite for normal text drawing
        g2.setComposite(AlphaComposite.SrcOver);

        // Draw the button text manually, centered
        String text = getText();
        if (text != null && !text.isEmpty()) {
            g2.setFont(getFont());
            g2.setColor(getForeground());
            FontMetrics fm = g2.getFontMetrics();

            int textWidth = fm.stringWidth(text);
            int textHeight = fm.getAscent();

            int x = (width - textWidth) / 2;
            int y = (height + textHeight) / 2 - fm.getDescent();

            g2.drawString(text, x, y);
        }

        g2.dispose();

        grphcs.drawImage(img, 0, 0, null);

        // Do NOT call super.paintComponent to avoid overwriting custom painting
    }
}
