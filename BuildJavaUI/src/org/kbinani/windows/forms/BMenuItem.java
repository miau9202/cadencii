package org.kbinani.windows.forms;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import javax.swing.JMenuItem;
import org.kbinani.BEvent;
import org.kbinani.BEventArgs;
import org.kbinani.BEventHandler;

public class BMenuItem extends JMenuItem implements ActionListener, MouseListener{
    private static final long serialVersionUID = -1354135252399786976L;
    private Object tag;
    private boolean checkOnClick = true;
    public BEvent<BEventHandler> clickEvent = new BEvent<BEventHandler>();
    public BEvent<BEventHandler> checkedChangedEvent = new BEvent<BEventHandler>();
    public BEvent<BEventHandler> mouseEnterEvent = new BEvent<BEventHandler>();
    public BEvent<BEventHandler> mouseLeaveEvent = new BEvent<BEventHandler>();

    public BMenuItem(){
        addActionListener( this );
    }
    
    public void actionPerformed( ActionEvent e ){
        if( checkOnClick ){
            this.setSelected( !this.isSelected() );
            try{
                checkedChangedEvent.raise( this, new BEventArgs() );
            }catch( Exception ex ){
                System.err.println( "BMenuItem#actionPerformed; ex=" + ex );
            }
        }
        try{
            clickEvent.raise( this, new BEventArgs() );
        }catch( Exception ex ){
            System.err.println( "BMenuItem#actionPerformed; ex=" + ex );
        }
    }

    public Object getTag(){
        return tag;
    }
    
    public void setTag( Object value ){
        tag = value;
    }

    public boolean isCheckOnClick(){
        return checkOnClick;
    }
    
    public void setCheckOnClick( boolean value ){
        checkOnClick = value;
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        // TODO 自動生成されたメソッド・スタブ
        
    }

    @Override
    public void mouseEntered(MouseEvent e) {
        try{
            mouseEnterEvent.raise( this, new BEventArgs() );
        }catch( Exception ex ){
            System.err.println( "BMenuItem#mouseEntered; ex=" + ex );
        }
    }

    @Override
    public void mouseExited(MouseEvent e) {
        try{
            mouseLeaveEvent.raise( this, new BEventArgs() );
        }catch( Exception ex ){
            System.err.println( "BMenuItem#mouseExited; ex=" + ex );
        }
    }

    @Override
    public void mousePressed(MouseEvent e) {
        // TODO 自動生成されたメソッド・スタブ
        
    }

    @Override
    public void mouseReleased(MouseEvent e) {
        // TODO 自動生成されたメソッド・スタブ
        
    }
}
